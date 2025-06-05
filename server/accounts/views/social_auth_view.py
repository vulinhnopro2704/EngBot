from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
import requests as http_requests
import cloudinary.uploader


User = get_user_model()

# Create your views here.
class GoogleAuthView(APIView):
    def post(self, request, *args, **kwargs):
        # Handle Google login logic here
        # Nhận id_token từ request
        id_token_str = request.data.get('id_token')
        if not id_token_str:
            return Response({"error": "id_token is required"}, status=400)

        try:
            # Xác thực id_token với Google
            client_id = settings.GOOGLE_OAUTH_CLIENT_ID
            idinfo = id_token.verify_oauth2_token(id_token_str, requests.Request(), client_id)

            # Kiểm tra xem id_token có hợp lệ không
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return Response({"error": "Wrong issuer."}, status=status.HTTP_400_BAD_REQUEST)


            # Lấy thông tin user từ token
            google_id = idinfo['sub']
            email = idinfo['email']
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')

            # Kiểm tra xem user đã tồn tại trong hệ thống chưa
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],  # Create username from email
                    'is_social': True,
                    'is_active': True,
                }
            )

            # Upload avatar từ Google lên Cloudinary
            # Nếu user đã có avatar thì không cần tải lại
            if not user.avatar and picture:
                try:
                    # Tải ảnh từ Google
                    response = http_requests.get(picture)
                    if response.status_code == 200:
                        # Upload lên Cloudinary
                        upload_result = cloudinary.uploader.upload(
                            response.content,  # Nội dung hình ảnh
                            folder="avatars",  # Thư mục lưu trên Cloudinary
                            public_id=f"user_{user.id}",  # Đặt tên file
                            overwrite=True  # Ghi đè nếu đã tồn tại
                        )

                        # Lưu URL Cloudinary vào trường avatar của user
                        user.avatar = upload_result['secure_url']
                        user.save()
                except Exception as e:
                    print(f"Lỗi khi upload avatar: {str(e)}")
                    # Không dừng quá trình - avatar không phải thông tin quan trọng

            # Tạo token JWT
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            # Trả về thông tin user và token
            response_data = {
                'refresh': str(refresh),
                'access': str(access),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'avatar': user.avatar if user.avatar else None,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError:

            # Invalid token

            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:

            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FacebookAuthView(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({"error": "access_token is required"}, status=400)

        try:
            # Verify token with Facebook
            graph_url = f"https://graph.facebook.com/me?fields=id,name,email,picture&access_token={access_token}"
            response = http_requests.get(graph_url)
            fb_data = response.json()

            if 'error' in fb_data:
                return Response({"error": fb_data['error']['message']}, status=400)

            # Extract user info
            facebook_id = fb_data['id']
            email = fb_data.get('email')
            name = fb_data.get('name')
            picture = fb_data.get('picture', {}).get('data', {}).get('url')

            # Handle missing email
            if not email:
                email = f"{facebook_id}@facebook.com"  # Generate a placeholder email

            # Kiểm tra xem user đã tồn tại trong hệ thống chưa
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],  # Create username from email
                    'is_social': True,
                    'is_active': True,
                }
            )

            # Upload avatar từ Google lên Cloudinary
            # Nếu user đã có avatar thì không cần tải lại
            if not user.avatar and picture:
                try:
                    # Tải ảnh từ Google
                    response = http_requests.get(picture)
                    if response.status_code == 200:
                        # Upload lên Cloudinary
                        upload_result = cloudinary.uploader.upload(
                            response.content,  # Nội dung hình ảnh
                            folder="avatars",  # Thư mục lưu trên Cloudinary
                            public_id=f"user_{user.id}",  # Đặt tên file
                            overwrite=True  # Ghi đè nếu đã tồn tại
                        )

                        # Lưu URL Cloudinary vào trường avatar của user
                        user.avatar = upload_result['secure_url']
                        user.save()
                except Exception as e:
                    print(f"Lỗi khi upload avatar: {str(e)}")
                    # Không dừng quá trình - avatar không phải thông tin quan trọng

            # Tạo token JWT
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            # Trả về thông tin user và token
            response_data = {
                'refresh': str(refresh),
                'access': str(access),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'avatar': user.avatar if user.avatar else None,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError:

            # Invalid token

            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:

            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
