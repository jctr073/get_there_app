# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

file = __dir__ + "/states.txt"
File.open(file, "r").each_line() do |line|
  states = line.split("|")
  State.create!(code: states[0], name: states[1].chomp)
  p states[0].chomp
end
