# calendar �?" zone24 schedule manager

Рабо�?ий п�?име�? MVC-п�?иложения для ведения �?асписания об�Sек�,а о�.�?ан�< `zone24`:

- **View**: React + **MUI** UI
- **Controller/ViewModel**: MobX store
- **Model**: `ScheduleModel`
- **Service**: `ScheduleService` с `fetch` на backend API
- **Backend**: Express REST API

## �-ап�fск

```bash
npm install
npm run server
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000

## Ч�,о �?еализовано

- �"одовой календа�?�O (12 меся�?ев) и левая панел�O �fп�?авления �?асписаниями.
- �Y�fс�,ое сос�,ояние с але�?�,ом «Режим �?або�,�< не нас�,�?оен» и кнопкой создания �?асписания.
- Создание основного �?асписания �?е�?ез �"о�?м�f с ин�,е�?валами для б�fдней/в�<�.одн�<�..
- Создание спе�?иал�Oн�<�. �?асписаний �?е�?ез кнопк�f «Созда�,�O +».
- �oножес�,венное добавление �?асписаний (основн�<�. и спе�?иал�Oн�<�.) с о�,об�?ажением ка�?�,о�?ек слева.
- �zк�?аска календа�?я:
  - б�fдни �?" зел�'н�<й,
  - в�<�.одн�<е �?" �,�'мно-зел�'н�<й,
  - спе�?иал�Oн�<е ин�,е�?вал�< �?" о�?анжев�<й (пове�?�. базовой логики).
- Удаление одного �?асписания и �fдаление все�. �?асписаний с�?аз�f.
- �'алида�?ии на се�?ве�?е:
  - `timeFrom < timeTo`;
  - `dateFrom < dateTo`;
  - зап�?е�, кон�"лик�,�f�Z�?и�. спе�?иал�Oн�<�. ин�,е�?валов с одинаков�<м п�?ио�?и�,е�,ом и `isOverrideBase = true`.

## API

- `GET /api/zones/zone24/schedules`
- `DELETE /api/zones/zone24/schedules`
- `POST /api/zones/zone24/base-schedules`
- `PUT /api/zones/zone24/base-schedules/:id`
- `DELETE /api/zones/zone24/base-schedules/:id`
- `POST /api/zones/zone24/special-schedules`
- `PUT /api/zones/zone24/special-schedules/:id`
- `DELETE /api/zones/zone24/special-schedules/:id`
