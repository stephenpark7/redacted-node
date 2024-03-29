export const Category = (sequelize: any, Sequelize: any) => {
  const Category = sequelize.define('Category', {
    category_id: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  });
  
  return Category;
};
