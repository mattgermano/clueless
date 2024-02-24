from django.urls import re_path

from . import consumers

# Because an HTTP request of the form http[s]://hostname/ws/type will be made
# to establish a connection to websocket ws[s]://hostname/ws/type, each
# websocket url pattern will need a corresponding http pattern added to
# ws.urls.urlpatterns


websocket_urlpatterns = [
    re_path(r"ws/hello-django$", consumers.PlayerMoveConsumer.as_asgi())
]
