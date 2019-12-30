from django.urls import path

import routing.views as views


urlpatterns = [
    path('drive-time/', views.QueryDriveTime.as_view(), name='drive-time'),
    path('drive-time-nodes/', views.DriveTimeNodeList.as_view(), name='drive-time-node-list'),
    path('drive-time-nodes/<int:pk>/', views.DriveTimeNodeDetail.as_view(), name='drive-time-node-detail'),
    path('drive-time-polygons/', views.DriveTimePolygonList.as_view(), name='drive-time-polygon-list'),
    path('drive-time-polygons/<int:pk>/', views.DriveTimePolygonDetail.as_view(), name='drive-time-polygon-detail'),
    path('drive-time-polygons/drive-time-queries/<int:drive_time_query>/', views.DriveTimePolygonByDriveTimeQueryDetail.as_view(), name='drive-time-polygon-by-query-detail'),
    path('drive-time-queries/', views.DriveTimeQueryList.as_view(), name='drive-time-query-list'),
    path('drive-time-queries/<int:pk>/', views.DriveTimeQueryDetail.as_view(), name='drive-time-query-detail'),
    path('ways/', views.WaysList.as_view(), name='ways-list'),
    path('ways/<int:pk>/', views.WaysDetail.as_view(), name='ways-detail'),
    path('ways-vertices-pgr/', views.WaysVerticesPgrList.as_view(), name='ways-vertices-pgr-list'),
    path('ways-vertices-pgr/<int:pk>/', views.WaysVerticesPgrDetail.as_view(), name='ways-vertices-pgr-detail'),
]
