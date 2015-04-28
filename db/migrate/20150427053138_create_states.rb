class CreateStates < ActiveRecord::Migration
  def change
    create_table :states do |t|
      t.string :code, limit: 2
      t.string :name

      t.timestamps
    end
    add_index :states, :id, unique: true
  end
end
