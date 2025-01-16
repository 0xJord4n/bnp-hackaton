from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CompetitorInputSerializer
from .utils.data_processing import process_main_company, process_similar_companies
from .utils.scoring_companies import process_scoring

class MainCompanyView(APIView):
    def post(self, request):
        serializer = CompetitorInputSerializer(data=request.data)
        if serializer.is_valid():
            domain = serializer.validated_data["domain"]
            result = process_main_company(domain)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompetitorsView(APIView):
    def post(self, request):
        serializer = CompetitorInputSerializer(data=request.data)
        if serializer.is_valid():
            domain = serializer.validated_data["domain"]
            result = process_similar_companies(domain)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ScoringView(APIView):
    """
    Endpoint to compute scoring for a target company and its competitors.
    """
    def post(self, request):
        try:
            target_company = request.data.get("domain")
            if not target_company:
                return Response(
                    {"error": "The 'target_company' field is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Process scoring
            result = process_scoring(target_company)

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

