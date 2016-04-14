Rails.application.routes.draw do
  resources :words
  get '/words/:id/toggle_approval', to: 'words#toggle_approval'
  resources :projector
  root 'words#new'
end
