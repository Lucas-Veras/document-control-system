from rest_framework.renderers import JSONRenderer


class CustomRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        if isinstance(data, dict) and data.get("success", None) is False:
            return super(CustomRenderer, self).render(data, accepted_media_type, renderer_context)

        response = {"data": data, "metadata": {}, "success": True, "errors": []}

        if data and "metadata" in data:
            response["metadata"] = data.pop("metadata")

        # Handling pagination
        if data and hasattr(data, "keys") and "results" in data.keys():
            response["data"] = data["results"]
            for key in data.keys():
                if key != "results":
                    response["metadata"][key] = data[key]

        return super(CustomRenderer, self).render(response, accepted_media_type, renderer_context)
