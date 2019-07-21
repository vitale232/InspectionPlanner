from django.urls import path

import routing.views as views


urlpatterns = [
    path('drive-time-nodes/', views.DriveTimeNodeList.as_view()),
    path('drive-time-nodes/<int:pk>/', views.DriveTimeNodeDetail.as_view()),
    path('drive-time-polygons/', views.DriveTimePolygonList.as_view()),
    path('drive-time-polygons/<int:pk>/', views.DriveTimePolygonDetail.as_view()),
    path('drive-time-queries/', views.DriveTimeQueryList.as_view()),
    path('drive-time-queries/<int:pk>/', views.DriveTimeQueryDetail.as_view()),
    path('ways/', views.WaysList.as_view()),
    path('ways/<int:pk>/', views.WaysDetail.as_view()),
    path('ways-vertices-pgr/', views.WaysVerticesPgrList.as_view()),
    path('ways-vertices-pgr/<int:pk>/', views.WaysVerticesPgrDetail.as_view()),
]
