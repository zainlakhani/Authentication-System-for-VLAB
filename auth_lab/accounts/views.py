from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect, render
from django.views.decorators.http import require_POST


def home(request):
    return render(request, "accounts/home.html")


def register_view(request):
    if request.user.is_authenticated:
        return redirect("profile")
    form = UserCreationForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = form.save()
        login(request, user)
        messages.success(request, "Your account is ready. You are now signed in.")
        return redirect("profile")
    return render(request, "accounts/register.html", {"form": form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect("profile")
    error = None
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, "You are signed in.")
            return redirect("profile")
        error = "Those details did not match an account. Try again."
    return render(request, "accounts/login.html", {"error": error})


@login_required
def profile_view(request):
    return render(request, "accounts/profile.html")


@require_POST
def logout_view(request):
    logout(request)
    messages.info(request, "You have signed out and your session has ended.")
    return redirect("home")


def feedback_view(request):
    if request.method == "POST":
        messages.success(request, "Thanks for sharing your feedback.")
        return redirect("home")
    return redirect("home")
