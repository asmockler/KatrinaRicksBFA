Rails.application.routes.draw do
  resources :words
  resources :projector
  root 'words#new'
end
