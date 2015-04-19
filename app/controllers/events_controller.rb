class EventsController < ApplicationController

  require 'eventbrite-client'
  require 'json'

  def index
    render :search
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
    eb = EventbriteV3.new
    eb.keywords = params[:search][:keywords]
    eb.add_param('venue.city', 'San Francisco')
    eb.add_param('venue.region', 'CA')

    resp = eb.event_search

    respond_to do |format|
      format.json { render json: resp }
    end
  end

end
