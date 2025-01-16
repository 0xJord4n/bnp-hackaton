from rest_framework import serializers

class CompetitorInputSerializer(serializers.Serializer):
    domain = serializers.URLField(required=True)

class CompanyDataSerializer(serializers.Serializer):
    # Define output fields
    entity_urn = serializers.CharField(required=False, allow_null=True)
    website_url = serializers.URLField(required=False, allow_null=True)
    website_domain = serializers.CharField(required=False, allow_null=True)
    logo_url = serializers.URLField(required=False, allow_null=True)
    name = serializers.CharField(required=False, allow_null=True)
    description = serializers.CharField(required=False, allow_null=True)
    # Add all fields as required
