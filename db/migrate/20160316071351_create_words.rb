class CreateWords < ActiveRecord::Migration
  def change
    create_table :words do |t|
      t.string :word, index: true, null: false
      t.integer :frequency, default: 1, null: false
      t.boolean :visible, default: false

      t.timestamps null: false
    end
  end
end
