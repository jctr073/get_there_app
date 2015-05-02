class EventbriteV3
  include HTTParty

  def initialize(token = '2GT6L3NCHSCTQQREGLKO')
    @base_uri   = 'https://www.eventbriteapi.com/v3/'
    @keywords   = Array.new
    @params     = Hash.new
    @auth_token = token
  end

  def keywords=value
    value.split(" ").each do |val|
      @keywords.push(val)
    end
  end

  def keywords
    if @keywords.empty?
      return ""
    else
      return "q=#{@keywords.join("+")}"
    end
  end

  def add_param(key, value)
    @params.store(key, value) if value != ""
  end

  def params
    @params.to_query
  end

  def event_search(page = 1)
    url = @base_uri + 'events/search/?' +
        keywords + '&sort_by=date&' + params +
        '&token=' + @auth_token

    url += '&page=' + page.to_s
    HTTParty.get(url)
  end

end