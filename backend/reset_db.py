from database import engine
from models import Base
import models # Import để nó nhận diện được các class

print("Đang xóa sạch dữ liệu cũ...")
# Lệnh này sẽ DROP toàn bộ bảng cũ, bất chấp đúng sai
Base.metadata.drop_all(bind=engine)

print("Đang xây lại nhà mới...")
# Lệnh này tạo lại bảng mới tinh theo đúng code models.py hiện tại
Base.metadata.create_all(bind=engine)

print("Xong phim! Database đã sạch sẽ và cập nhật mới nhất.")