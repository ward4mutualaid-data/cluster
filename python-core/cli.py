#!/usr/bin/env python3

import argparse
import os
import sys
import time
from pathlib import Path

from config import HERE_API_KEY
from geocode.here import HereClient

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="Batch Geo-coder",
        description="Geocode addresses in CSV files using the Here API",
    )
    parser.add_argument(
        "working-dir",
        type=Path,
        help="absolute or relative path to directory to save result files",
    )
    parser.add_argument(
        "batch-file",
        type=Path,
        help="absolute or relative path to batch file to submit for geocoding",
    )

    args: dict = vars(parser.parse_args())
    cwd: Path = Path(os.getcwd())
    working_dir: Path = args["working-dir"]
    if not working_dir.is_absolute():
        working_dir = cwd / working_dir
    if not (working_dir.exists() and working_dir.is_dir()):
        print(f"Invalid working-dir '{working_dir}'. It must exist and be a directory.")
        sys.exit(1)

    batch_file: Path = args["batch-file"]
    if not batch_file.is_absolute():
        batch_file = cwd / batch_file
    if not (batch_file.exists() and batch_file.is_file()):
        print(f"Invalid batch '{batch_file}'. It must exist and be a file.")
        sys.exit(1)

    client = HereClient(HERE_API_KEY, working_dir)
    request_id = client.send_batch(batch_file)
    for i in range(30):
        status = client.get_job_status(request_id)
        if status.lower() == "completed":
            break
        time.sleep(10)

    result_path: Path = client.get_batch_result(request_id)
    print(f"All done. Results are here: '{result_path}'.")
