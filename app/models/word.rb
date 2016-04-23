require 'obscenity/active_model'

class Word < ActiveRecord::Base
  validates :word, obscenity: true
end
