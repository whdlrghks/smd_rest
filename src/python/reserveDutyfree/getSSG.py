from selenium import webdriver
from bs4 import BeautifulSoup
import re
import os
import sys

def remove_html_tags(data):
    p = re.compile(r'<.*?>')
    return p.sub('\n', data)

dir_path = os.path.dirname(os.path.realpath(os.getcwd()))
driver = webdriver.Chrome('/home/cloudpool/Desktop/Capstone/chromedriver')
driver.get('https://www.ssgdfm.com/shop/main')
driver.implicitly_wait(3)
driver.find_element_by_xpath('//*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[1]/a').click()
driver.implicitly_wait(6)
window_before = driver.window_handles[0]
window_after = driver.window_handles[2]

driver.switch_to_window(window_after)
driver.find_element_by_name('userId').send_keys(sys.argv[1])
driver.find_element_by_name('password').send_keys(sys.argv[2])
driver.find_element_by_xpath('//*[@id="loginForm"]/div/div[2]/input').click()
driver.implicitly_wait(1)
try:
    result = driver.current_url
except :
    driver.switch_to_window(driver.window_handles[0])
    result =  driver.current_url
driver.switch_to_window(driver.window_handles[0])
driver.find_element_by_xpath('//*[@id="ssgdf-header"]/div[2]/div/div[2]/ul/li[2]/a').click()
driver.implicitly_wait(1)
driver.find_element_by_xpath('//*[@id="Form1"]/div/div[2]/div[1]/div[1]/div[2]/ul/li[2]/a').click()
driver.implicitly_wait(3)
html = driver.page_source
soup = BeautifulSoup(html,'html.parser')
driver.quit()
#총 적립금만 가져오기
req1 = soup.find("p",{"class" : "dataTxt"}).find("span")
price1 = remove_html_tags(str(req1))
price1 = "".join(price1.split());
price1 = price1.replace("원","");
print(price1)
