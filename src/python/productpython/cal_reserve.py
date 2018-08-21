# -*- coding: utf-8 -*-
"""
Created on Sun Aug 19 20:00:42 2018

@author: tjsal
"""
import sys
# 3사 면세점 전부 같음

def cal_reserve(percent,price,reserve): # percent : 적립금 가능 퍼센트, price : 상품 가격, reserve : 적립금액
    if percent == 0:
        discount_price = price
    else:
        if reserve >= (price * float(percent/100)):
            discount_price = price * (1 - float(percent/100))
        else:
            discount_price = price - reserve

    print(discount_price)

cal_reserve(sys.argv[1],sys.argv[2],sys.argv[3])
