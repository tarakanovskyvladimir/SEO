#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import datetime
now = datetime.datetime.now()
url_trash='https://ru.wikipedia.org/wiki/%D0%90%D0%BD%D0%B4%D1%80%D0%BE%D0%BF%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD'
data_trash=pd.read_html(url_trash, attrs={'class': 'sortable'}, skiprows=1, header=0, index_col=0)[0].filter(items=['Наименование', 'Население']).replace(regex=[r'^.?[↗↘]', r'\[\d+\]$', r'\s(?=\d+)'], value='')
data_trash['Население'] = pd.to_numeric(data_trash['Население'], errors='coerce')
data_trash['За месяц']=data_trash['Население']*75
data_trash.loc[data_trash['Население'] > 10000, 'За месяц'] = data_trash['Население']*110
data_trash['За год']=data_trash['За месяц']*12
data_trash.to_csv('Плановый сбор денежных средств за вывоз мусора на {} год.csv'.format(now.year), encoding = 'utf-8', sep='\t')
print(data_trash)