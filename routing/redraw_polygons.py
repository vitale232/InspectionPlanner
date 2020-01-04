from datetime import datetime
import os
import urllib.parse
import time
import traceback

from bridges.models import NewYorkBridge
from .models import DriveTimeQuery, DriveTimePolygon

os.chdir('/home/vitale232/Documents/InspectionPlanner/inspection_planner/lambda-drive-time-polygons')
import handler


def run():
    drive_time_polygons = DriveTimePolygon.objects.all()
    drive_time_ids = [dtq.id for dtq in drive_time_polygons]

    does_not_exist = []
    error_ids = []
    exceptions = []
    for drive_time_id in drive_time_ids:
        try:
            dtq = DriveTimeQuery.objects.get(pk=drive_time_id)
        except DriveTimeQuery.DoesNotExist:
            does_not_exist.append(drive_time_id)
            print(f'Skipping Drive Time ID {drive_time_id}')
            continue
        try:
            print(f'Working on Drive Time ID {drive_time_id}')
            bridges = NewYorkBridge.objects.filter(drive_time_queries__contains=[drive_time_id])

            for bridge in bridges:
                ids_set = set(bridge.drive_time_queries)
                ids_set.remove(drive_time_id)
                bridge.drive_time_queries = list(ids_set)
                bridge.save()

            existing_polygons = DriveTimePolygon.objects.filter(drive_time_query=drive_time_id)
            delete_ = existing_polygons.delete()
            print(delete_)

            event = {
                'drive_time_query': drive_time_id
            }

            handler.main(event, '')
            print(f'Complete {drive_time_id}!')
        except Exception as exc:
            print(f'Error on {drive_time_id}')
            print(f'Exception: {traceback.format_exc()}')
            error_ids.append(drive_time_id)
            exceptions.append(exc)
    for exc, drive_time_id in zip(error_ids, exceptions):
        print(f'{drive_time_id} | {exc}')
    print(f'Drive Time does not exist: {does_not_exist}')
    print(f'Failed IDs: {error_ids}')
