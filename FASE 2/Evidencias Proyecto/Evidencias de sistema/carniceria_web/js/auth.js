import { supabase } from './supabaseClient.js';


window.addEventListener('load', () => {

  if (!window.location.pathname.includes("login.html")) {
    console.log("auth.js: No estamos en login.html, no se ejecuta el código de login.");
    return;
  }

  const form = document.getElementById('loginForm');
  const mensaje = document.getElementById('mensaje');

  if (!form) {
    console.warn("auth.js: No se encontró el formulario con id='loginForm'.");
    return;
  }

  // Escuchar el submit del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    mensaje.textContent = '';

    // Iniciar sesión con Supabase Auth
    const { data: sessionData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      mensaje.textContent = 'Credenciales incorrectas o usuario no registrado.';
      console.error(error);
      return;
    }

    console.log('Usuario logueado:', sessionData.user);
    localStorage.setItem('usuario', JSON.stringify(sessionData.user));

    // Buscar usuario en tabla 'usuario'
    const { data: usuarioDB, error: usuarioError } = await supabase
      .from('usuario')
      .select('usuario_id')
      .eq('auth_user_id', sessionData.user.id)
      .single();

    if (usuarioError || !usuarioDB) {
      mensaje.textContent = 'No se encontró el usuario en la base de datos.';
      console.error(usuarioError);
      return;
    }

    const usuarioId = usuarioDB.usuario_id;
    console.log("ID del usuario en tabla 'usuario':", usuarioId);

    // Buscar rol
    const { data: rolData, error: rolError } = await supabase
      .from('usuario_rol')
      .select('rol_id')
      .eq('usuario_id', usuarioId)
      .single();

    if (rolError || !rolData) {
      mensaje.textContent = 'El usuario no tiene un rol asignado.';
      console.error(rolError);
      return;
    }

    const rol_id = rolData.rol_id;
    console.log("Rol del usuario:", rol_id);

    localStorage.setItem('rol', rol_id);

    // Redirigir según el rol
    if (rol_id === 1) {
      window.location.href = 'pag_principal.html';
    } else if (rol_id === 2 || rol_id === 3) {
      window.location.href = 'menu.html';
    } else {
      mensaje.textContent = 'Rol desconocido. Contacte al administrador.';
    }
  });
});





