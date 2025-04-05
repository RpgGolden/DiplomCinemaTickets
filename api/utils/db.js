import { models, sequelize } from "../models/index.js";
import setupAssociations from "../models/setup-associations.js";

async function initializeDbModels() {
  // Инициализация схем моделей
  for (const model of Object.values(models)) {
    if (typeof model.initialize === "function") {
      model.initialize(sequelize);
    }
  }

  // Установка связей между моделями
  setupAssociations(models);

  // ✅ Глобальная синхронизация, чтобы Sequelize сам понял порядок
  await sequelize.sync({ alter: true });

  console.log("Models initialized successfully");
}

export default {
  initializeDbModels,
};
