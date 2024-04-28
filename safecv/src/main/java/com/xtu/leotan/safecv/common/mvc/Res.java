package com.xtu.leotan.safecv.common.mvc;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record Res<T>(@Schema(description = "是否成功", example = "true") boolean success,
                     @Schema(description = "状态码", example = "200") int code,
                     @Schema(description = "消息", example = Res.SUCCESS_MESSAGE) String message,
                     @Schema(description = "数据体", example = "json body") T data) {
    public static final int SUCCESS_CODE = 200;
    public static final int ERROR_CODE = 500;
    public static final int BAD_REQUEST_CODE = 400;
    public static final String SUCCESS_MESSAGE = "success";

    public static <T> @NotNull Res<T> success(T data) {
        return new Res<>(true, SUCCESS_CODE, SUCCESS_MESSAGE, data);
    }

    public static <T> @NotNull Res<T> error(String message) {
        return new Res<>(false, ERROR_CODE, message, null);
    }

    public static <T> @NotNull Res<T> badRequest(String message) {
        return new Res<T>(false, BAD_REQUEST_CODE, message, null);
    }
}
