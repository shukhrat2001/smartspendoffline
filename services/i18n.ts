import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Language } from '../types';

export const translations = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_history: "History",
    nav_reports: "Reports",
    nav_settings: "Settings",
    
    // Dashboard
    offline_mode: "OFFLINE MODE • Changes saved locally",
    total_spent_today: "Total Spent Today",
    upgrade_cloud: "Upgrade to unlock cloud sync and backup.",
    this_month: "This Month",
    on_track: "On Track",
    budget: "Budget",
    set_limit: "Set Limit",
    upgrade_premium: "Upgrade to Premium",
    unlock_features: "Unlock unlimited history & export",
    view_plan: "View Plan",
    recent_expenses: "Recent Expenses",
    view_all: "View All",
    no_expenses: "No expenses yet",
    tap_add: "Tap + to add your first one",
    pending: "Pending",
    unlock_all: "Unlock all features today.",
    
    // Add Expense
    add_expense: "Add Expense",
    amount: "Amount",
    category: "Category",
    new_category: "New Category",
    date: "Date",
    note_optional: "Note (Optional)",
    what_for: "What was this for?",
    receipt: "Receipt",
    take_photo: "Take Photo",
    save_expense: "Save Expense",
    saving: "Saving...",
    enter_cat_name: "Enter new category name:",
    
    // History
    history_title: "History",
    search_placeholder: "Search expenses...",
    no_expenses_found: "No expenses found",
    premium_history: "Premium History",
    upgrade_history_msg: "Upgrade to view expense history older than 30 days.",
    
    // Reports
    spending_reports: "Spending Reports",
    total_spent: "Total Spent",
    category_breakdown: "Category Breakdown",
    weekly_trend: "Weekly Spending Trend",
    advanced_analytics: "Advanced Analytics",
    unlock_analytics_msg: "Unlock weekly trends, budget forecasting, and more.",
    unlock_premium: "Unlock Premium",
    
    // Settings
    data_management: "Data Management",
    clear_data: "Clear Data",
    reset_app: "Reset App & Clear Data",
    upgrade_manage: "Upgrade / Manage Plan",
    app_version: "Version 1.1.0 (Offline Capable)",
    select_language: "Language",
    
    // Premium Modal
    unlock_full: "Unlock Full Power",
    hit_limit: "You've hit a free limit.",
    feat_history: "Unlimited expense history",
    feat_receipts: "Unlimited receipt photos",
    feat_custom_cat: "Custom categories",
    feat_reports: "Advanced reports & insights",
    feat_export: "Export to CSV/PDF",
    feat_cloud: "Cloud backup & Sync",
    start_trial: "Start your 7-day free trial",
    per_month: "/month",
    annual_save: "or save $10 with annual plan",
    start_free_trial: "Start Free Trial",
    cancel_anytime: "Cancel anytime. No questions asked.",
    
    // Categories (Defaults)
    cat_food: "Food",
    cat_transport: "Transport",
    cat_bills: "Bills",
    cat_shopping: "Shopping",
    cat_other: "Other",

    // Alerts
    export_premium: "Exporting data to CSV/PDF is a Premium feature.",
    payment_success: "Payment successful! Premium features unlocked.",
    welcome_premium: "Welcome to Premium! All features unlocked.",
    delete_confirm: "Delete all data? This cannot be undone."
  },
  ru: {
    nav_home: "Главная",
    nav_history: "История",
    nav_reports: "Отчеты",
    nav_settings: "Настройки",
    
    offline_mode: "ОФЛАЙН • Изменения сохранены локально",
    total_spent_today: "Расходы сегодня",
    upgrade_cloud: "Обновитесь для синхронизации и бэкапа.",
    this_month: "В этом месяце",
    on_track: "В норме",
    budget: "Бюджет",
    set_limit: "Задать",
    upgrade_premium: "Перейти на Premium",
    unlock_features: "Вся история и экспорт",
    view_plan: "Обзор",
    recent_expenses: "Недавние расходы",
    view_all: "Все",
    no_expenses: "Нет расходов",
    tap_add: "Нажмите +, чтобы добавить",
    pending: "Ожидание",
    unlock_all: "Открыть все функции",
    
    add_expense: "Добавить расход",
    amount: "Сумма",
    category: "Категория",
    new_category: "Новая категория",
    date: "Дата",
    note_optional: "Заметка (опционально)",
    what_for: "На что потрачено?",
    receipt: "Чек",
    take_photo: "Сделать фото",
    save_expense: "Сохранить",
    saving: "Сохранение...",
    enter_cat_name: "Введите название категории:",
    
    history_title: "История",
    search_placeholder: "Поиск расходов...",
    no_expenses_found: "Расходы не найдены",
    premium_history: "Premium История",
    upgrade_history_msg: "Обновитесь для просмотра истории старше 30 дней.",
    
    spending_reports: "Отчеты о расходах",
    total_spent: "Всего потрачено",
    category_breakdown: "По категориям",
    weekly_trend: "Тренды недели",
    advanced_analytics: "Продвинутая аналитика",
    unlock_analytics_msg: "Тренды, бюджеты и другое.",
    unlock_premium: "Открыть Premium",
    
    data_management: "Управление данными",
    clear_data: "Очистить данные",
    reset_app: "Сброс и очистка данных",
    upgrade_manage: "Управление планом",
    app_version: "Версия 1.1.0 (Работает офлайн)",
    select_language: "Язык (Language)",
    
    unlock_full: "Полная версия",
    hit_limit: "Лимит бесплатной версии.",
    feat_history: "Безлимитная история",
    feat_receipts: "Безлимитные фото чеков",
    feat_custom_cat: "Свои категории",
    feat_reports: "Продвинутые отчеты",
    feat_export: "Экспорт в CSV/PDF",
    feat_cloud: "Облачный бэкап",
    start_trial: "7 дней бесплатно",
    per_month: "/мес",
    annual_save: "или сэкономьте $10/год",
    start_free_trial: "Попробовать бесплатно",
    cancel_anytime: "Отмена в любое время.",
    
    cat_food: "Еда",
    cat_transport: "Транспорт",
    cat_bills: "Счета",
    cat_shopping: "Покупки",
    cat_other: "Другое",

    export_premium: "Экспорт в CSV/PDF доступен в Premium.",
    payment_success: "Оплата прошла успешно! Premium доступен.",
    welcome_premium: "Добро пожаловать в Premium!",
    delete_confirm: "Удалить все данные? Это необратимо."
  },
  tg: {
    nav_home: "Асосӣ",
    nav_history: "Таърих",
    nav_reports: "Ҳисобот",
    nav_settings: "Танзимот",
    
    offline_mode: "ОФЛАЙН • Тағйиротҳо маҳаллӣ захира шуданд",
    total_spent_today: "Хароҷоти имрӯз",
    upgrade_cloud: "Барои синхронизатсия Premium гиред.",
    this_month: "Ин моҳ",
    on_track: "Дар ҳолат",
    budget: "Буҷет",
    set_limit: "Танзим",
    upgrade_premium: "Гузаштан ба Premium",
    unlock_features: "Таърихи пурра ва содирот",
    view_plan: "Нақша",
    recent_expenses: "Хароҷоти охирин",
    view_all: "Ҳама",
    no_expenses: "Хароҷот нест",
    tap_add: "Барои илова + пахш кунед",
    pending: "Интызорӣ",
    unlock_all: "Кушодани ҳама имкониятҳо",
    
    add_expense: "Иловаи хароҷот",
    amount: "Маблағ",
    category: "Категория",
    new_category: "Категорияи нав",
    date: "Сана",
    note_optional: "Тавзеҳ (ихтиёрӣ)",
    what_for: "Барои чӣ?",
    receipt: "Чек",
    take_photo: "Аксгирӣ",
    save_expense: "Захира",
    saving: "Захирашавӣ...",
    enter_cat_name: "Номи категорияро ворид кунед:",
    
    history_title: "Таърих",
    search_placeholder: "Ҷустуҷӯи хароҷот...",
    no_expenses_found: "Хароҷот ёфт нашуд",
    premium_history: "Таърихи Premium",
    upgrade_history_msg: "Барои дидани таърихи >30 рӯз Premium гиред.",
    
    spending_reports: "Ҳисоботи хароҷот",
    total_spent: "Ҷамъи хароҷот",
    category_breakdown: "Аз рӯи категорияҳо",
    weekly_trend: "Раванди ҳафтаина",
    advanced_analytics: "Аналитикаи пешрафта",
    unlock_analytics_msg: "Равандҳо ва буҷетҳоро кушоед.",
    unlock_premium: "Кушодани Premium",
    
    data_management: "Идоракунии маълумот",
    clear_data: "Тоза кардани маълумот",
    reset_app: "Бозсозӣ ва тозакунӣ",
    upgrade_manage: "Идоракунии нақша",
    app_version: "Версияи 1.1.0 (Офлайн кор мекунад)",
    select_language: "Забон (Language)",
    
    unlock_full: "Имкониятҳои пурра",
    hit_limit: "Маҳдудияти версияи ройгон.",
    feat_history: "Таърихи бемаҳдуд",
    feat_receipts: "Аксҳои бемаҳдуд",
    feat_custom_cat: "Категорияҳои шахсӣ",
    feat_reports: "Ҳисоботи пешрафта",
    feat_export: "Содирот ба CSV/PDF",
    feat_cloud: "Нусхаи эҳтиётӣ дар абр",
    start_trial: "7 рӯз ройгон",
    per_month: "/моҳ",
    annual_save: "ё $10 дар як сол сарфа кунед",
    start_free_trial: "Оғози ройгон",
    cancel_anytime: "Бекоркунӣ дар вақти дилхоҳ.",
    
    cat_food: "Хӯрок",
    cat_transport: "Нақлиёт",
    cat_bills: "Пардохтҳо",
    cat_shopping: "Харид",
    cat_other: "Дигар",

    export_premium: "Содирот ба CSV/PDF дар Premium дастрас аст.",
    payment_success: "Пардохт муваффақ шуд! Premium фаъол гардид.",
    welcome_premium: "Хуш омадед ба Premium!",
    delete_confirm: "Ҳамаи маълумотро нест мекунед? Ин амал баргардонида намешавад."
  }
};

export const useTranslation = () => {
  const settings = useLiveQuery(() => db.settings.toArray());
  const language = (settings?.[0]?.language || 'en') as Language;

  const t = (key: keyof typeof translations['en']) => {
    return translations[language]?.[key] || translations['en'][key];
  };

  const getCategoryName = (id: string, customName: string) => {
    // If it's a default category ID (like 'food', 'transport'), return translated string
    const key = `cat_${id}` as keyof typeof translations['en'];
    if (translations[language]?.[key]) {
      return translations[language][key];
    }
    // Fallback to English default if not found in current lang but exists in EN
    if (translations['en'][key]) {
      return translations['en'][key];
    }
    // Otherwise it's a custom category, return stored name
    return customName;
  };

  const setLanguage = (lang: Language) => {
    // Assuming single user with ID 1 based on db.ts population
    db.settings.update(1, { language: lang });
  };

  return { t, language, setLanguage, getCategoryName };
};
