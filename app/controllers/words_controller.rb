class WordsController < ApplicationController
  before_action :set_word, only: [:show, :edit, :update, :destroy, :toggle_approval]

  # GET /words
  # GET /words.json
  def index
    @words = Word.order('created_at DESC').all

    respond_to do |format|
      format.html { render :index }
      format.json { render json: Word.all.where(visible: true) }
    end
  end

  # GET /words/1
  # GET /words/1.json
  def show
  end

  # GET /words/new
  def new
    @word = Word.new
  end

  # GET /words/1/edit
  def edit
  end

  # POST /words
  # POST /words.json
  def create
    # Normalize the input
    input = word_params[:word].downcase

    # If the word already exists, just update the frequency count
    begin
      @word = Word.find_by_word(input)
      current_frequency = @word.frequency
      @word.assign_attributes(frequency: current_frequency + 1)
    rescue
      @word = Word.new(word_params)
    end

    respond_to do |format|
      if @word.save
        format.html { redirect_to @word, notice: 'Word was successfully created.' }
        format.json { render :show, status: :created, location: @word }
      else
        format.html { render :new }
        format.json { render json: @word.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /words/1
  # PATCH/PUT /words/1.json
  def update
    respond_to do |format|
      if @word.update(word_params)
        format.html { redirect_to @word, notice: 'Word was successfully updated.' }
        format.json { render :show, status: :ok, location: @word }
      else
        format.html { render :edit }
        format.json { render json: @word.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /words/1
  # DELETE /words/1.json
  def destroy
    @word.destroy
    respond_to do |format|
      format.html { redirect_to words_url, notice: 'Word was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # GET /words/1/toggle_approval
  def toggle_approval
    @word.update_attribute(:visible, !@word.visible)

    render json: {visibility: @word.visible}, status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_word
      @word = Word.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def word_params
      params.fetch(:word, {}).permit(:word, :frequency, :visible)
    end
end
