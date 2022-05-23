import React from "react";
import './Footer.css'

export default function (){
    return (
        <>
        <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6>About</h6>
            <p className="text-justify">
                JK có 05 đơn vị thành viên đang hoạt động trong lĩnh vực vận tải hành khách. Quản lý gần 1.000 phương tiện vận tải hành khách, là đơn vị chủ lực phục vụ nhu cầu vận tải hành khách công cộng trên địa bàn khu vực miền Nam, 
                nhu cầu vận tải du lịch trong nước và quốc tế của người dân.
                Bên cạnh đó, JK hiện đang quản lý các bến xe có qui mô lớn nhất TP.HCM như: bến xe Miền Đông, bến xe Miền Tây, bến xe Ngã Tư Ga, bến xe An Sương, 
                cung cấp các dịch vụ vận chuyển hành khách liên tỉnh đi khắp mọi miền của đất nước.
            </p>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Categories</h6>
            <ul className="footer-links">
              <li><a href="#">Bến xe</a></li>
              <li><a href="#">Các mẫu xe</a></li>
              <li><a href="#">Tuyến xe</a></li>
              <li><a href="#">Giá vé</a></li>
              <li><a href="#">Tuyển dụng</a></li>
            </ul>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Quick Links</h6>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Contribute</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">Copyright &copy; 2021  Rights  by JK
            </p>
          </div>

          <div className="col-md-4 col-sm-6 col-xs-12">
            <ul className="social-icons">
              <li><a className="facebook" href="facebook"><i className="fa fa-facebook"></i></a></li>
              <li><a className="twitter" href="twitter"><i className="fa fa-twitter"></i></a></li>
              <li><a className="dribbble" href="dribbble"><i className="fa fa-dribbble"></i></a></li>
              <li><a className="linkedin" href="linkedin"><i className="fa fa-linkedin"></i></a></li>   
            </ul>
          </div>
        </div>
      </div>
</footer>
        </>
    )
}