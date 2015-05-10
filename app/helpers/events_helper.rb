module EventsHelper
  def long_datetime(value)
    Time.zone.parse(value).strftime("%B %-d, %Y %I:%M %p")
  end
end
