import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
    const decoded = jwtDecode(token);
console.log(decoded.exp * 1000 < Date.now());

  try {
    const decoded = jwtDecode(token);

    // التحقق من انتهاء التوكين
    if (decoded.exp * 1000 < Date.now() ) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    if (decoded.role == "customer") {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

  } catch (error) {
    // لو التوكين بايظ
    console.log(error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;