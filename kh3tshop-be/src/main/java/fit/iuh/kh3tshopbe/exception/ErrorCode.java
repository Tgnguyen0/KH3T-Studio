package fit.iuh.kh3tshopbe.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_EXISTED(1001, "User already exists", HttpStatus.CREATED),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    ADDRESS_NOT_FOUND(1002, "Address not found", HttpStatus.NOT_FOUND),
    UnknownError(1003, "Unknown error",HttpStatus.BAD_REQUEST),
    Username_Error(1004, "Username must have at least 3 characters",HttpStatus.BAD_REQUEST),
    Password_Error(1004, "Password must have at least 6 characters", HttpStatus.BAD_REQUEST),
    User_Not_Authenticated(1005, "User not authenticated", HttpStatus.BAD_REQUEST),
    Token_Generation_Failed( 1006, "token failed " , HttpStatus.BAD_REQUEST),
    Password_Failed(1004, "Password failed", HttpStatus.BAD_REQUEST),
    User_Not_Authorized(1007, "User not authorized", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(1008,"Toke is not available" , HttpStatus.BAD_REQUEST),
    CUSTOMER_NOT_FOUND(2001, "Customer not found", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(3001, "Category not found", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND(3000,"Product not found" , HttpStatus.NOT_FOUND),
    SIZE_NOT_FOUND(3002, "Size not found", HttpStatus.NOT_FOUND),
    SIZE_DETAIL_NOT_FOUND(3002, "Size detail not found", HttpStatus.NOT_FOUND),
    INVOICE_NOT_FOUND(3003, "Invoice not found", HttpStatus.NOT_FOUND),
    ACCOUNT_NOT_FOUND(3004, "Account not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(3005, "Order not found", HttpStatus.NOT_FOUND);

    private int code;
    private String message;

    private HttpStatusCode httpStatusCode;
    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }


}
