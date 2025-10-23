import { supabase } from './supabaseClient.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('registerForm');
  const mensaje = document.getElementById('mensaje');

  // Escuchar el envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const rut = document.getElementById('rut').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmarPassword = document.getElementById('confirmarPassword').value.trim();

    // Validación básica de contraseñas
    if (password !== confirmarPassword) {
      mensaje.textContent = 'Las contraseñas no coinciden.';
      return;
    }

    // Crear usuario en Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (userError) {
      mensaje.textContent = 'Error al registrar usuario: ' + userError.message;
      console.error(userError);
      return;
    }

    console.log("Usuario creado en Auth:", userData.user.id);

    // Insertar en tabla usuario
    const { data: usuarioInsertado, error: insertError } = await supabase
      .from('usuario')
      .insert([{
        email,
        nombre,
        cliente_id: null,
        hash_password: password,
        activo: true,
        auth_user_id: userData.user.id
      }])
      .select('usuario_id')
      .single();

    if (insertError) {
      mensaje.textContent = 'Error al guardar el usuario: ' + insertError.message;
      console.error(insertError);
      return;
    }

    const nuevoUsuarioId = usuarioInsertado.usuario_id;
    console.log("Nuevo usuario creado con ID:", nuevoUsuarioId);

    const { error: rolError } = await supabase
      .from('usuario_rol')
      .insert([{ usuario_id: nuevoUsuarioId, rol_id: 1 }]);

    if (rolError) {
      mensaje.textContent = 'Error al asignar el rol: ' + rolError.message;
      console.error(rolError);
      return;
    }

    console.log("Rol cliente asignado correctamente al usuario.");

    // Crear registro en la tabla cliente (asociado al usuario)
    const { data: clienteInsertado, error: clienteError } = await supabase
      .from('cliente')
      .insert([{
        nombre_razon: nombre,
        email: email,
        rut: rut || null,
        estado: 'activo',
        creado_en: new Date()
      }])
      .select('cliente_id')
      .single();

    if (clienteError) {
      console.error("Error al crear cliente:", clienteError.message);
    } else {
      // Asociar cliente_id al usuario recién creado
      await supabase
        .from('usuario')
        .update({ cliente_id: clienteInsertado.cliente_id })
        .eq('usuario_id', nuevoUsuarioId);

      console.log("Cliente asociado correctamente al usuario.");
    }

    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
  });
});


