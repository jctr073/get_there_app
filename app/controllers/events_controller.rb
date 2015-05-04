class EventsController < ApplicationController

  # require 'eventbrite-client'
  # require 'json'

  def index
    @states = State.all.map { |s| [s.name, s.code] }
  end

  def show
  end

  def search
    p params
    eb = EventbriteV3.new
    eb.keywords = params[:search][:keywords]
    eb.add_param('venue.city', params[:search][:city])
    eb.add_param('venue.region', params[:search][:state])
    eb.add_param('start_date.range_start', con_date(params[:search][:fromDt]))
    eb.add_param('start_date.range_end', con_date(params[:search][:toDt]))

    resp = eb.event_search(params[:page])

    respond_to do |format|
      format.json { render json: resp }
    end
  end

  private
    def con_date(value)
      if value == ""
        return ""
      else
        Time.zone.parse(value).utc.strftime("%Y-%m-%dT%TZ")
      end

    end
end
