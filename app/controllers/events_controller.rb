class EventsController < ApplicationController

  require 'eventbrite-client'
  require 'json'

  def index
  end

  def old_search
    # words = params[:search][:keywords] || ""

    clt = EventbriteClient.new({ access_token: '2GT6L3NCHSCTQQREGLKO'})
    resp = clt.event_search(region: "CA", keywords: "wine")

    respond_to do |format|
      format.html { render html: resp }
      format.json { render json: resp }
    end
  end

  def search_v2
    base = 'https://www.eventbriteapi.com/v3/'
    mthd = 'events/search/'

    if params[:search][:keywords] != ""
      kywrd = "q=#{params[:search][:keywords]}&"
    else
      kywrd = ""
    end

    qry  = "?#{kywrd}venue.city=San+Francisco&venue.region=CA&"
    p(qry)
    token = 'token=2GT6L3NCHSCTQQREGLKO'
    api_url  = base + mthd + qry + token
    resp = HTTParty.get(api_url)

    respond_to do |format|
      format.json { render json: resp }
    end
  end

  def search
    p params
    eb = EventbriteV3.new
    eb.keywords = params[:search][:keywords]
    eb.add_param('venue.city', params[:search][:city])
    eb.add_param('venue.region', params[:search][:state])
    eb.add_param('start_date.range_start', con_date(params[:search][:fromDt]))
    eb.add_param('start_date.range_end', con_date(params[:search][:toDt]))

    resp = eb.event_search

    respond_to do |format|
      format.json { render json: resp }
    end
  end

  private
    def con_date(value)
      Time.zone.parse(value).utc.strftime("%Y-%m-%dT%TZ")
    end
end
