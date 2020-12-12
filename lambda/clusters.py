from __future__ import annotations

import json
from copy import deepcopy
from dataclasses import dataclass
from random import uniform
from statistics import mean, pstdev
from typing import Generic, List, Sequence, TypeVar, Tuple

from datapoint import DataPoint


def lambda_handler(event, context):
    print("value1 = " + event["key1"])
    print("value2 = " + event["key2"])
    print("value3 = " + event["key3"])

    points = [DataPoint(point) for point in json.loads(event["coords"])]
    max_size = 5
    num_points = len(points)
    if num_points % max_size == 0:
        num_clusters = int(num_points / max_size)
    else:
        num_clusters = int(num_points / max_size) + 1

    kmeans: KMeans[DataPoint] = KMeans(num_clusters, points, max_size=max_size)
    clusters: List[Cluster] = kmeans.run()
    flat_clusters = []
    for c in clusters:
        flat_clusters.append([p._originals for p in c.points])
    return json.dumps(flat_clusters)


def zscores(original: Sequence[float]) -> List[float]:
    avg: float = mean(original)
    std: float = pstdev(original)
    if std == 0:  # return all zeros if there is no variation
        return [0] * len(original)
    return [(x - avg) / std for x in original]


Point = TypeVar("Point", bound=DataPoint)


@dataclass
class Cluster:
    points: List[Point]
    centroid: DataPoint
    max_size: int

    @property
    def is_full(self) -> bool:
        return len(self.points) >= self.max_size


class KMeans(Generic[Point]):
    def __init__(self, k: int, points: List[Point], max_size=float("inf")) -> None:
        if k < 1:  # k-means can't do negative or zero clusters
            raise ValueError("k must be >= 1")
        self._points: List[Point] = points
        self._zscore_normalize()
        # initialize empty clusters with random centroids
        self._clusters: List[Cluster] = []
        for _ in range(k):
            rand_point: DataPoint = self._random_point()
            cluster: Cluster = Cluster([], rand_point, max_size)
            self._clusters.append(cluster)

    @property
    def _centroids(self) -> List[DataPoint]:
        return [x.centroid for x in self._clusters]

    def _dimension_slice(self, dimension: int) -> List[float]:
        return [x.dimensions[dimension] for x in self._points]

    def _zscore_normalize(self) -> None:
        zscored: List[List[float]] = [[] for _ in range(len(self._points))]
        for dimension in range(self._points[0].num_dimensions):
            dimension_slice: List[float] = self._dimension_slice(dimension)
            for index, zscore in enumerate(zscores(dimension_slice)):
                zscored[index].append(zscore)
        for i in range(len(self._points)):
            self._points[i].dimensions = tuple(zscored[i])

    def _random_point(self) -> DataPoint:
        rand_dimensions: List[float] = []
        for dimension in range(self._points[0].num_dimensions):
            values: List[float] = self._dimension_slice(dimension)
            rand_value: float = uniform(min(values), max(values))
            rand_dimensions.append(rand_value)
        return DataPoint(rand_dimensions)

    # Find the closest cluster centroid to each point and assign the point to that cluster
    def _assign_clusters(self) -> None:
        # [distance to nearest centroid, DataPoint, list of centroids ordered by nearness]
        points_with_nearness: List[Tuple[float, Datapoint, List[DataPoint]]] = []
        for point in self._points:
            centroids_and_distance: List[Tuple[float, DataPoint]] = [
                (point.distance(cen), cen) for cen in self._centroids
            ]
            # sort centroids in order of nearness
            centroids_and_distance.sort(key=lambda x: x[0])
            points_with_nearness.append(
                # tuple of distance to nearest centroid and centroids ordered by distance
                (
                    centroids_and_distance[0][0],
                    point,
                    [x[1] for x in centroids_and_distance],
                )
            )
        # order by points nearest to centroids
        points_with_nearness.sort(key=lambda x: x[0])
        for _, point, centroids in points_with_nearness:
            for cen in centroids:
                idx: int = self._centroids.index(cen)
                cluster: Cluster = self._clusters[idx]
                if not cluster.is_full:
                    cluster.points.append(point)
                    break

    # Find the center of each cluster and move the centroid to there
    def _generate_centroids(self) -> None:
        for cluster in self._clusters:
            if len(cluster.points) == 0:  # keep the same centroid if no points
                continue
            means: List[float] = []
            for dimension in range(cluster.points[0].num_dimensions):
                dimension_slice: List[float] = [
                    p.dimensions[dimension] for p in cluster.points
                ]
                means.append(mean(dimension_slice))
            cluster.centroid = DataPoint(means)

    def run(self, max_iterations: int = 100) -> List[Cluster]:
        for iteration in range(max_iterations):
            for cluster in self._clusters:  # clear all clusters
                cluster.points.clear()
            self._assign_clusters()  # find cluster each point is closest to
            old_centroids: List[DataPoint] = deepcopy(self._centroids)  # record
            self._generate_centroids()  # find new centroids
            if old_centroids == self._centroids:  # have centroids moved?
                print(f"Converged after {iteration} iterations")
                return self._clusters
        return self._clusters


if __name__ == "__main__":
    from random import random

    points = [
        DataPoint([round(random() * 20, 1), round(random() * 20, 1)]) for i in range(20)
    ]

    # points = [
    #     DataPoint([0.0, 0.0]),
    #     DataPoint([1.0, 1.0]),
    #     DataPoint([2.0, 2.0]),
    #     DataPoint([3.0, 3.0]),
    #     DataPoint([4.0, 4.0]),
    #     DataPoint([5.0, 5.0]),
    #     DataPoint([6.0, 6.0]),
    #     DataPoint([7.0, 7.0]),
    #     DataPoint([8.0, 8.0]),
    #     DataPoint([9.0, 9.0]),
    # ]
    kmeans_test: KMeans[DataPoint] = KMeans(4, points, max_size=5)
    test_clusters: List[Cluster] = kmeans_test.run()
    for index, cluster in enumerate(test_clusters):
        # print(f"Cluster {index}")
        print()
        for p in cluster.points:
            print(f"{p._originals[0]} {p._originals[1]} ", end="")
