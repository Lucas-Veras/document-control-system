"""
Swagger UI for API documentation
"""

from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions


def list_to_openapi_parameter(items):
    parameter_list = []
    for item in items:
        if type(item) is str:
            item = {"name": item}
        parameter = {
            "name": item["name"],
            "required": item.get("required", False),
            "in": item.get("in_", "query"),
            "schema": {"type": item.get("type", "str")},
        }
        parameter_list.append(
            openapi.Parameter(
                parameter["name"], parameter["in"], type=parameter["schema"], required=parameter["required"]
            )
        )

    return parameter_list


schema_view = get_schema_view(
    openapi.Info(
        title="MY docs API",
        default_version="v1",
        description="API for MyDocs.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("swagger<format>/", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]
