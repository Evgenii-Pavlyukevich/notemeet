export const translations = {
  title: 'VideoNotes',
  fileUpload: {
    dragAndDrop: 'Перетащите аудио/видео файл сюда или нажмите для выбора',
    selectedFile: 'Выбранный файл:',
    supportedFormats: 'Поддерживаемые форматы: MP3, MP4, WAV, M4A, WebM (макс. 25MB)',
    errors: {
      unsupportedType: 'Неподдерживаемый формат файла',
      sizeLimit: 'Размер файла превышает 25MB',
      uploadSuccess: 'Файл успешно загружен',
    },
  },
  meetingForm: {
    title: 'Название встречи',
    context: 'Бизнес-контекст',
    participants: {
      title: 'Участники',
      addParticipant: 'Добавить участника',
      name: 'Имя',
      position: 'Должность',
    },
    submit: {
      process: 'Обработать встречу',
      processing: 'Обработка...',
    },
    errors: {
      requiredFields: 'Пожалуйста, заполните все обязательные поля',
    },
  },
  results: {
    tabs: {
      transcription: 'Транскрипция',
      summary: 'Краткое содержание',
      decisions: 'Ключевые решения',
      actions: 'План действий',
    },
    noData: {
      transcription: 'Транскрипция отсутствует',
      summary: 'Краткое содержание отсутствует',
      decisions: 'Решения не записаны',
      actions: 'План действий отсутствует',
    },
  },
  errors: {
    apiKey: 'Ключ OpenAI API не настроен',
    missingFields: 'Отсутствуют обязательные поля',
    processingError: 'Ошибка обработки записи встречи',
    timeout: 'Превышено время ожидания. Пожалуйста, попробуйте файл меньшей длительности.',
  },
}; 