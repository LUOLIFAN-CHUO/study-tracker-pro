import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "title": "Study Tracker Pro",
      "switch_account": "Switch Account",
      "add": "Add New Record",
      "chart_title": "Study Progress Distribution",
      "project_title": "Project Title",
      "select_lang": "Select Language",
      "add_btn": "Add Record"
    }
  },
  zh: {
    translation: {
      "title": "学习进度仪 Pro",
      "switch_account": "切换账号",
      "add": "添加新纪录",
      "chart_title": "学习进度分布",
      "project_title": "项目名称",
      "select_lang": "选择语言",
      "add_btn": "添加记录"
    }
  },
  jp: {
    translation: {
      "title": "学習トラッカー Pro",
      "switch_account": "アカウント切替",
      "add": "新しい記録",
      "chart_title": "学習進捗分布",
      "project_title": "項目名",
      "select_lang": "言語を選択",
      "add_btn": "記録を追加"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh", // 默认语言
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;