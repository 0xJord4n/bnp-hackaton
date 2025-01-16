from django.urls import path
from .views import MainCompanyView, CompetitorsView, ScoringView

urlpatterns = [
    path("main/", MainCompanyView.as_view(), name="main_company"), 
    path("list/", CompetitorsView.as_view(), name="competitors"), 
    path("scoring/", ScoringView.as_view(), name="scoring"),
]