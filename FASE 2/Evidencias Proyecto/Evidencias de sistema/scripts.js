import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


const SUPABASE_URL = "https://bagilcaibwidyewiqqzd.supabase.co/";
const SUPABASE_KEY = "sb_secret_LWcrGJWG9swWAMe90ehvPQ_6wgS8yeD";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarProductos() {
  const contenedor = document.getElementById("lista-productos");

  const { data, error } = await supabase.from("producto").select("*");

  if (error) {
    contenedor.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    return;
  }

  contenedor.innerHTML = data.map(prod => `
    <div class="producto">
      <h3>${prod.nombre}</h3>
      <p><strong>Precio:</strong> $${prod.precio}</p>
      <p><strong>Categoría:</strong> ${prod.categoria_id}</p>
    </div>
  `).join("");
}

// Llamar a la función al cargar la página
cargarProductos();


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZ2lsY2FpYndpZHlld2lxcXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMjY3NDEsImV4cCI6MjA3NDYwMjc0MX0.VsVsH8c9fpjKxgmuNWYUCqE8e8DDcXicUELTexNJaAU