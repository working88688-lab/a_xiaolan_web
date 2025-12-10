FROM node:18.7.0

# 工作目录
WORKDIR /app

# 复制文件
COPY .output ./.output

# 网关定义
ENV PORT 3082
ENV HOST 0.0.0.0

# 暴露端口
EXPOSE 3082

# 运行应用
CMD ["node", "./.output/server/index.mjs", "--port", "$PORT", "--host", "$HOST"]

#
RUN echo '镜像创建完成~'