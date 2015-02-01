from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from uuidfield import UUIDField
from push_notifications.fields import HexIntegerField
from users.models import User

# Compatibility with custom user models, while keeping backwards-compatibility with <1.5
#AUTH_USER_MODEL = getattr(settings, "User", "users.User")


class Device(models.Model):
	name = models.CharField(max_length=255, verbose_name=_("Name"), blank=True, null=True)
	active = models.BooleanField(verbose_name=_("Is active"), default=True,
		help_text=_("Inactive devices will not be sent notifications"))
	user = models.ForeignKey(User, to_field='vk_id')
	date_created = models.DateTimeField(verbose_name=_("Creation date"), auto_now_add=True, null=True)

	class Meta:
		abstract = True

	def __unicode__(self):
		return self.user.vk_id or str(self.device_id or "") or "%s for %s" % (self.__class__.__name__, self.user or "unknown user")


class GCMDeviceManager(models.Manager):
	def get_queryset(self):
		return GCMDeviceQuerySet(self.model)
	get_query_set = get_queryset  # Django < 1.6 compatiblity


class GCMDeviceQuerySet(models.query.QuerySet):
	def send_message(self, message, **kwargs):
		if self:
			from push_notifications.gcm import gcm_send_bulk_message
			data = kwargs.pop("extra", {})
			if message is not None:
				data["message"] = message
			return gcm_send_bulk_message(
				registration_ids=list(self.values_list("registration_id", flat=True)),
				data=data)


class GCMDevice(Device):
	# device_id cannot be a reliable primary key as fragmentation between different devices
	# can make it turn out to be null and such:
	# http://android-developers.blogspot.co.uk/2011/03/identifying-app-installations.html
	device_id = HexIntegerField(verbose_name=_("Device ID"), blank=True, null=True,
		help_text="ANDROID_ID / TelephonyManager.getDeviceId() (always as hex)")
	registration_id = models.TextField(verbose_name=_("Registration ID"))

	objects = GCMDeviceManager()

	class Meta:
		verbose_name = _("GCM device")

	def send_message(self, message, **kwargs):
		from push_notifications.gcm import gcm_send_message
		data = kwargs.pop("extra", {})
		if message is not None:
			data["message"] = message
		return gcm_send_message(registration_id=self.registration_id, data=data, **kwargs)


class APNSDeviceManager(models.Manager):
	def get_queryset(self):
		return APNSDeviceQuerySet(self.model)
	get_query_set = get_queryset  # Django < 1.6 compatiblity


class APNSDeviceQuerySet(models.query.QuerySet):
	def send_message(self, message, **kwargs):
		if self:
			from push_notifications.apns import apns_send_bulk_message
			return apns_send_bulk_message(registration_ids=list(self.values_list("registration_id", flat=True)), alert=message, **kwargs)


# in the future.  But the definition of 'expired' may not be the same. Whatevs
# This is an APNS-only function right now, but maybe GCM will implement it
class APNSDevice(Device):
	device_id = UUIDField(verbose_name=_("Device ID"), blank=True, null=True, help_text="UDID / UIDevice.identifierForVendor()")
	registration_id = models.CharField(verbose_name=_("Registration ID"), max_length=64, unique=True)
	objects = APNSDeviceManager()

	class Meta:
		verbose_name = _("APNS device")

	def send_message(self, message, **kwargs):
		from push_notifications.apns import apns_send_message
		return apns_send_message(registration_id=self.registration_id, alert=message, **kwargs)

	def __unicode__(self):
		return self.registration_id + '+' + self.user.vk_id

	def __str__(self):
		return self.registration_id + '+' + self.user.vk_id



def get_expired_tokens():
	from push_notifications.apns import apns_fetch_inactive_ids
	return apns_fetch_inactive_ids()
