from database import engine
from models import Base
import models

print("Đang xóa sạch dữ liệu cũ...")

Base.metadata.drop_all(bind=engine)

print("Đang xây lại nhà mới...")

Base.metadata.create_all(bind=engine)

print("Xong phim! Database đã sạch sẽ và cập nhật mới nhất.")