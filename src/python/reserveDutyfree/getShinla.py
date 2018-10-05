from selenium import webdriver
from bs4 import BeautifulSoup
import re
import os
import sys
def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('\n', data)



# <<<<<<< HEAD
# dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
# driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')
#
# =======
# dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
# driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')
options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('window-size=1920x1080')
options.add_argument("--disable-gpu")
# 혹은 options.add_argument("--disable-gpu")

driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver', chrome_options=options)
# >>>>>>> d52e0ffd2ce47e1e55cdbc6dec1beba44997717e

driver.get('https://www.shilladfs.com/estore/kr/ko/login')
driver.find_element_by_xpath('//*[@id="container"]/div[1]/div/div/div[2]/div/a').click()
driver.implicitly_wait(2)
window_before = driver.window_handles[0]
window_after = driver.window_handles[1]

driver.switch_to_window(window_after)

driver.find_element_by_name('j_username').send_keys(sys.argv[1])
driver.find_element_by_name('j_password').send_keys(sys.argv[2])
driver.find_element_by_xpath('//*[@id="loginForm"]/div/div/div/div[2]/div[1]/a').click()
driver.implicitly_wait(2)
driver.switch_to_window(window_before)
driver.find_element_by_xpath('//*[@id="header"]/div[2]/div/div[1]/ul/li[3]/a').click()
html = driver.page_source
soup = BeautifulSoup(html,'html.parser')
driver.quit()
reserved = str(soup.find("dl",{"class":"save"}).find("dd").find("span").find("em"))
#원화 -> 달러 변환

price = remove_html_tags(reserved)
price = "".join(price.split());
price = price.replace(",","")
reserved_1 = int(price)/1110.2
reserved_final = str(round(reserved_1,2))
print(reserved_final)
