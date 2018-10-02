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
# =======
# dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
# driver = webdriver.Chrome('/Users/ikhwan/capstone/chromedriver')
options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('window-size=1920x1080')
options.add_argument("--disable-gpu")
# 혹은 options.add_argument("--disable-gpu")

driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver', chrome_options=options)
# >>>>>>> d52e0ffd2ce47e1e55cdbc6dec1beba44997717e
driver.get('https://www.ssgdfm.com/shop/main')
# driver.implicitly_wait(3)
# driver.find_element_by_xpath('//*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[1]/a').click()
# driver.implicitly_wait(6)
# window_before = driver.window_handles[0]
# window_after = driver.window_handles[1]
#
# driver.switch_to_window(window_after)
# driver.find_element_by_name('userId').send_keys(sys.argv[1])
# driver.find_element_by_name('password').send_keys(sys.argv[2])
# driver.find_element_by_xpath('//*[@id="loginForm"]/div/div[2]/input').click()
# driver.implicitly_wait(1)
# try:
#     result = driver.current_url
# except :
#     driver.switch_to_window(driver.window_handles[0])
#     result =  driver.current_url
driver.switch_to_window(driver.window_handles[0])
title4 = WebDriverWait(driver, 600) \
    .until(EC.presence_of_element_located((By.CSS_SELECTOR, "#ssgdf-header > div.headWrap > div > div.markList > ul > li:nth-child(1) > a")))
# //*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[1]/a
driver.find_element_by_xpath('//*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[1]/a').click()
# driver.implicitly_wait(5)
window_before = driver.window_handles[0]
window_after = driver.window_handles[1]
driver.implicitly_wait(10)
driver.switch_to_window(window_after)
driver.find_element_by_name('userId').send_keys(sys.argv[1])
driver.find_element_by_name('password').send_keys(sys.argv[2])
driver.find_element_by_xpath('//*[@id="loginForm"]/div/div[2]/input').click()
driver.implicitly_wait(3)
try:
    driver.switch_to_window(window_after)
    result = driver.current_url
except :
    driver.switch_to_window(window_before)
    result = driver.current_url

driver.switch_to_window(driver.window_handles[0])
driver.find_element_by_xpath('//*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[2]/a').click()
driver.implicitly_wait(1)
driver.find_element_by_xpath('//*[@id="Form1"]/div/div/div[1]/div[1]/div[2]/ul/li[2]/a').click()

driver.implicitly_wait(3)
html = driver.page_source
soup = BeautifulSoup(html,'html.parser')
driver.quit()
#총 적립금만 가져오기
req1 = soup.find("p",{"class" : "dataTxt"}).find("span")

price1 = remove_html_tags(str(req1))
price1 = "".join(price1.split());
price1 = price1.replace("원","");
price1 = price1.replace(",","")
reserved_1 = int(price1) / 1110.2
reserved_final = str(round(reserved_1,2))
print(reserved_final)
