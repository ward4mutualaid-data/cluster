import zipfile
from pathlib import Path
from typing import List

import requests
import xmltodict


class HereApiError(Exception):
    pass


class HereClient:
    batch_geocode_url = "https://batch.geocoder.ls.hereapi.com/6.2/jobs"

    def __init__(self, api_key: str, working_dir: Path, verbose: bool = True):
        self.api_key: str = api_key
        self.verbose: bool = verbose
        self.working_dir: Path = working_dir

    def send_batch(self, file_path: str) -> str:
        """Send a batch of addresses to be geocoded and return the Request ID"""
        path = open(file_path, "rb")
        resp = requests.post(
            self.batch_geocode_url,
            params={
                "apiKey": self.api_key,
                "indelim": "|",
                "outdelim": "|",
                "action": "run",
                "outcols": "displayLatitude,displayLongitude,locationLabel,houseNumber,street,district,city,postalCode,county,state,country",
                "outputcombined": True,
            },
            data=path,
            headers={"Content-Type": "text/plain"},
        )
        if not (200 <= resp.status_code < 300):
            print(
                f"Error sending batch data. Status code: '{resp.status_code}'. Raw response: '{resp.text}'"
            )
        if self.verbose:
            print(f"Batch submission succeeded with status code '{resp.status_code}'.")
        request_id: str = self._parse_batch_submission_response(resp.text)
        if self.verbose:
            print(f"Batch Request ID: '{request_id}'")
        return request_id

    def _parse_batch_submission_response(self, raw_xml: str) -> str:
        parsed = xmltodict.parse(raw_xml)
        try:
            return parsed["ns2:SearchBatch"]["Response"]["MetaInfo"]["RequestId"]
        except KeyError as exc:
            raise HereApiError(
                f"Response from batch submission is an unexpected format. Raw response '{raw_xml}'"
            ) from exc

    def get_job_status(self, request_id: str) -> str:
        url = f"{self.batch_geocode_url}/{request_id}"
        resp = requests.get(
            url,
            params={
                "apiKey": self.api_key,
                "action": "status",
            },
        )
        status: str = self._parse_batch_status_response(resp.text)
        if self.verbose:
            print(f"Batch status: '{status}'")
        return status

    def _parse_batch_status_response(self, raw_xml: str) -> str:
        parsed = xmltodict.parse(raw_xml)
        try:
            return parsed["ns2:SearchBatch"]["Response"]["Status"]
        except KeyError as exc:
            raise HereApiError(
                f"Response from batch submission is an unexpected format. Raw response '{raw_xml}'"
            ) from exc

    def get_batch_result(self, request_id: str) -> Path:
        url = f"{self.batch_geocode_url}/{request_id}/result"
        resp = requests.get(
            url,
            params={
                "apiKey": self.api_key,
            },
        )
        zip_file_name = f"{request_id}.zip"
        zip_file_path: Path = self.working_dir / Path(zip_file_name)
        zip_file_path.write_bytes(resp.content)
        if self.verbose:
            print(f"Saved batch results to {zip_file_path}")
        zip_file = zipfile.ZipFile(str(zip_file_path))
        zip_members: List[str] = zip_file.namelist()
        if len(zip_members) > 1:
            print(f"Expected one zip file member, but found {zip_members}.")
        for zm in zip_members:
            if zm.startswith("result_") and zm.endswith("_out.txt"):
                zip_file.extract(zm, path=self.working_dir)
                return self.working_dir / zm
            else:
                print(f"Unexpected zip file member: {zm}")
