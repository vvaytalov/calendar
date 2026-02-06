# calendar — zone24 schedule manager

Рабочий пример MVC-приложения для ведения расписания объекта охраны `zone24`:
- **View**: React + **MUI** UI
- **Controller/ViewModel**: MobX store
- **Model**: `ScheduleModel`
- **Service**: `ScheduleService` с `fetch` на backend API
- **Backend**: Express REST API

## Запуск

```bash
npm install
npm run server
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000

## Что реализовано

- Годовой календарь (12 месяцев) и левая панель управления расписаниями.
- Пустое состояние с алертом «Режим работы не настроен» и кнопкой создания расписания.
- Создание основного расписания через форму с интервалами для будней/выходных.
- Создание специальных расписаний через кнопку «Создать +».
- Множественное добавление расписаний (основных и специальных) с отображением карточек слева.
- Окраска календаря:
  - будни — зелёный,
  - выходные — тёмно-зелёный,
  - специальные интервалы — оранжевый (поверх базовой логики).
- Удаление одного расписания и удаление всех расписаний сразу.
- Валидации на сервере:
  - `timeFrom < timeTo`;
  - `dateFrom < dateTo`;
  - запрет конфликтующих специальных интервалов с одинаковым приоритетом и `isOverrideBase = true`.

## API

- `GET /api/zones/zone24/schedules`
- `DELETE /api/zones/zone24/schedules`
- `POST /api/zones/zone24/base-schedules`
- `PUT /api/zones/zone24/base-schedules/:id`
- `DELETE /api/zones/zone24/base-schedules/:id`
- `POST /api/zones/zone24/special-schedules`
- `PUT /api/zones/zone24/special-schedules/:id`
- `DELETE /api/zones/zone24/special-schedules/:id`
