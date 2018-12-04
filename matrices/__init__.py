#!/usr/bin/python3
from tornado.web import RequestHandler
import numpy as np

# функция создает случайный набор целых чисел от 1 до 10 и возвращает матрицу
# generates random set of integers (1 to 10) and returns as matrix
def gen_random_matrix(w, h):
    return np.random.randint(1, 10, size=(w, h))

# создает единичную матрицу указанного размера
def gen_identity_matrix(w):
    return np.identity(w, int)

# умножает матрицы
# multiplies two matrices
def mul_matrices(m1, m2):
    return np.matmul(m1, m2)

# дочерний класс RequestHandler (используется сервером heroku для прослушки адреса /matrices)
class Handler(RequestHandler):
    # обработчик get-запросов
    def get(self):
        # путь до шаблона страницы
        path = '../_templates/matrices_www/index.html'
        # сохраняем значения, переданные в get-запросе
        # parses arguments
        rows = self.get_argument('rows', None)
        columns = self.get_argument('columns', None)
        answer_type = self.get_argument('answer_type', None)
        is_identity = self.get_argument('is_identity', None)
        # объект, хранящий в себе данные, возвращаемые сервером
        # holds all matrices
        matrices = {
            'status': False,            # статус (True, если сервер отработал без ошибок)
            'err_msg': 'нет ошибок',    # текстовое сообщение об ошибке
            'first': None,              # первая матрица
            'second': None,             # вторая матрицы
            'multiplication': None,     # умноженная матрица
            'answer_type': None         # тип ответа (используется для отображения матриц на стороне клиента)
        }
        # пробуем сгенерировать матрицы основываясь на полученных данных
        # generates matrices
        try:
            # конвертируем строки в целые числа
            rows = int(rows)
            columns = int(columns)
            # если нужно создать обычные матрицы, создаем
            if not is_identity:
                matrices['first'] = gen_random_matrix(rows, columns)
                matrices['second'] = gen_random_matrix(columns, rows)
            # если нужно умножить на единичную матрицу, создаем 
            # квадратную матрицу размеров (row x row) и единичную
            else:
                matrices['first'] = gen_random_matrix(rows, rows)
                matrices['second'] = gen_identity_matrix(rows)
            # умножаем матрицы
            matrices['multiplication'] = mul_matrices(matrices['first'], matrices['second'])
            # конвертируем тип ответа в целое число
            matrices['answer_type'] = int(answer_type)
            # статус выполнения задачи - без ошибок
            matrices['status'] = True
        # при неудаче вернуть в тексте ошибки текст исключения (для отладки и т.д.)
        # do nothing then failure
        except (ValueError, TypeError) as e:
            matrices['err_msg'] = e
        # "нарисовать" страницу по шаблону, указанному в path
        # renders page and sends object with matrices
        self.render(path, matrices=matrices)

# модуль не является standalone (т.к. является компонентом heroku)
if '__main__' == __name__:
    print('This is "matrices" module. For mor information see "matrices/__init__.py".')
