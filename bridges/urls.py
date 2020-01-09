from django.urls import path

import bridges.views as views


urlpatterns = [
    path('new-york-bridges/', views.NewYorkBridgeList.as_view(), name='new-york-bridge-list'),
    path('new-york-bridges/feeling-lucky/', views.NewYorkBridgeRandom.as_view(), name='new-york-bridge-feeling-lucky-list'),
    path('new-york-bridges/<int:pk>/', views.NewYorkBridgeDetail.as_view(), name='new-york-bridge-detail'),
    path('new-york-bridges/drive-time-query/<int:id_>/', views.NewYorkBridgeDriveTime.as_view(), name='new-york-bridge-drive-time'),
    path('new-york-bridges/colormap/', views.NewYorkBridgeColorMap.as_view(), name='new-york-bridge-colormap-generator'),
    path('new-york-bridges/distinct/<str:field_name>/', views.NewYorkBridgeDistinct.as_view(), name='new-york-distinct-field'),
]
