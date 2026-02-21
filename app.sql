
-- ============================================================
-- UNIVERSO DEL JUEGO - BASE DE DATOS ESTILO SOULS/WORLDBUILDING
-- ============================================================

-- Tabla de categorías jerárquicas (Objetos, Locaciones y sus subcategorías)
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL, -- 'objeto' | 'locacion'
  categoria_padre_id UUID, -- NULL = categoría raíz, UUID = subcategoría
  descripcion TEXT,
  icono VARCHAR(255),
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de personajes
CREATE TABLE personajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(150) NOT NULL,
  titulo VARCHAR(200),
  slug VARCHAR(150) NOT NULL UNIQUE,
  lore TEXT,
  descripcion_corta VARCHAR(500),
  imagen_png_url VARCHAR(500),
  imagen_arte_url VARCHAR(500),
  clase VARCHAR(100), -- Guerrero, Mago, Arquero, etc.
  origen VARCHAR(150),
  estado VARCHAR(50) DEFAULT 'vivo', -- 'vivo' | 'muerto' | 'desconocido' | 'inmortal'
  es_protagonista BOOLEAN DEFAULT FALSE,
  orden_circulo INTEGER DEFAULT 0, -- posición en el selector circular
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de objetos
CREATE TABLE objetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  categoria_id UUID NOT NULL, -- soft key → categorias.id
  subcategoria_id UUID, -- soft key → categorias.id (nivel más específico)
  descripcion_lore TEXT, -- texto de sabor críptico estilo Souls
  descripcion_corta VARCHAR(500),
  imagen_url VARCHAR(500),
  rareza VARCHAR(50) DEFAULT 'comun', -- 'comun' | 'raro' | 'epico' | 'legendario' | 'unico'
  como_obtener TEXT,
  estadisticas JSONB, -- { "ataque": 120, "peso": 8.5, "durabilidad": 200 }
  personaje_asociado_id UUID, -- soft key → personajes.id
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de locaciones
CREATE TABLE locaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL, -- 'region' | 'mazmorra' | 'secreto'
  descripcion_lore TEXT,
  descripcion_corta VARCHAR(500),
  imagen_url VARCHAR(500),
  imagen_mapa_url VARCHAR(500),
  region_padre_id UUID, -- soft key → locaciones.id (para mazmorras dentro de regiones)
  peligrosidad VARCHAR(50) DEFAULT 'media', -- 'baja' | 'media' | 'alta' | 'mortal'
  descubierto BOOLEAN DEFAULT TRUE, -- FALSE = secreto no revelado aún
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de actualizaciones (sección "Último")
CREATE TABLE actualizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL, -- 'personaje' | 'objeto' | 'locacion' | 'historia' | 'general'
  descripcion_corta VARCHAR(500),
  contenido TEXT,
  imagen_url VARCHAR(500),
  referencia_id UUID, -- soft key → id del personaje/objeto/locacion relacionado
  referencia_tipo VARCHAR(50), -- 'personaje' | 'objeto' | 'locacion'
  es_destacado BOOLEAN DEFAULT FALSE, -- aparece en el banner principal
  publicado BOOLEAN DEFAULT TRUE,
  fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relaciones entre personajes (para el árbol de relaciones)
CREATE TABLE personaje_relaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personaje_origen_id UUID NOT NULL, -- soft key → personajes.id
  personaje_destino_id UUID NOT NULL, -- soft key → personajes.id
  tipo_relacion VARCHAR(100), -- 'aliado' | 'enemigo' | 'maestro' | 'discipulo' | 'rival' | 'familiar'
  descripcion VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- DATOS DE EJEMPLO - CATEGORÍAS
-- ============================================================

-- Categorías raíz
INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden) VALUES
('Armas', 'armas', 'objeto', NULL, 'Instrumentos de guerra forjados en las fraguas del mundo antiguo', 1),
('Armaduras', 'armaduras', 'objeto', NULL, 'Protecciones que han sobrevivido a batallas olvidadas por la historia', 2),
('Consumibles', 'consumibles', 'objeto', NULL, 'Elixires y preparados de alquimistas y herboristas errantes', 3),
('Objetos Clave', 'objetos-clave', 'objeto', NULL, 'Reliquias cuyo propósito trasciende el entendimiento mortal', 4);

-- Subcategorías de Armas
INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Espadas', 'espadas', 'objeto', id, 'Hojas que han bebido la sangre de dioses y mortales por igual', 1 FROM categorias WHERE slug = 'armas';

INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Lanzas', 'lanzas', 'objeto', id, 'Armas de alcance que atraviesan armaduras y voluntades', 2 FROM categorias WHERE slug = 'armas';

INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Arcos', 'arcos', 'objeto', id, 'La muerte silenciosa que llega antes de ser vista', 3 FROM categorias WHERE slug = 'armas';

INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Bastones', 'bastones', 'objeto', id, 'Conductores de energías que no deberían existir en este plano', 4 FROM categorias WHERE slug = 'armas';

-- Subcategorías de Armaduras
INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Tela', 'armadura-tela', 'objeto', id, 'Vestiduras imbuidas con encantamientos arcanos', 1 FROM categorias WHERE slug = 'armaduras';

INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Cuero', 'armadura-cuero', 'objeto', id, 'Pieles curtidas de bestias que no deberían haber sido cazadas', 2 FROM categorias WHERE slug = 'armaduras';

INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Malla', 'armadura-malla', 'objeto', id, 'Anillos entrelazados que han resistido el paso de eras', 3 FROM categorias WHERE slug = 'armaduras';

INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Placas', 'armadura-placas', 'objeto', id, 'Fortalezas portátiles para quienes cargan el peso del mundo', 4 FROM categorias WHERE slug = 'armaduras';

-- Subcategorías de Consumibles
INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Pociones', 'pociones', 'objeto', id, 'Líquidos que desafían las leyes de la naturaleza', 1 FROM categorias WHERE slug = 'consumibles';

INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden)
SELECT 'Utilidad', 'utilidad', 'objeto', id, 'Herramientas para quienes planean sobrevivir', 2 FROM categorias WHERE slug = 'consumibles';

-- Categorías de Locaciones
INSERT INTO categorias (nombre, slug, tipo, categoria_padre_id, descripcion, orden) VALUES
('Regiones', 'regiones', 'locacion', NULL, 'Vastas tierras con sus propias historias y cicatrices', 1),
('Mazmorras', 'mazmorras', 'locacion', NULL, 'Abismos donde la oscuridad tiene nombre propio', 2),
('Secretos', 'secretos', 'locacion', NULL, 'Lugares que el mundo preferiría olvidar', 3);

-- ============================================================
-- DATOS DE EJEMPLO - PERSONAJES
-- ============================================================

INSERT INTO personajes (nombre, titulo, slug, lore, descripcion_corta, clase, origen, estado, es_protagonista, orden_circulo, imagen_png_url) VALUES
('Valdris el Cenizo', 'El Último Portador de la Llama', 'valdris-el-cenizo', 'Dicen que Valdris murió tres veces antes de aprender a vivir. Portador de una llama que no consume pero ilumina lo que nadie desea ver, camina entre ruinas buscando algo que ya no recuerda haber perdido.', 'Un guerrero maldito que porta la llama de los caídos', 'Guerrero', 'Las Tierras Grises', 'inmortal', TRUE, 1, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200'),
('Seraphel', 'La Tejedora de Sombras', 'seraphel', 'Nadie sabe si Seraphel nació de la oscuridad o si la oscuridad nació de ella. Sus hilos invisibles conectan destinos que prefieren no estar conectados. Sonríe raramente, y cuando lo hace, algo en el mundo cambia.', 'Hechicera de las artes prohibidas del tejido sombrío', 'Hechicera', 'El Vacío Susurrante', 'vivo', FALSE, 2, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200'),
('Korrath', 'El Escudo Roto', 'korrath', 'Fue el mejor paladín de su orden hasta que su orden decidió que la fe era un arma más conveniente que una virtud. Ahora carga su escudo partido como recordatorio de lo que protegió y de lo que no pudo.', 'Paladín caído que busca redención en la batalla', 'Paladín', 'La Ciudad Sagrada de Auren', 'vivo', FALSE, 3, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200'),
('Nyxara', 'Flecha del Crepúsculo', 'nyxara', 'Nyxara no falla. No porque sea perfecta, sino porque redefine el objetivo después de disparar. Arquera de los bosques que ya no existen, caza lo que otros no pueden ver.', 'Arquera fantasma de los bosques perdidos', 'Arquera', 'El Bosque de Mireth', 'desconocido', FALSE, 4, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200'),
('Theron el Viejo', 'Memoria de Piedra', 'theron-el-viejo', 'Theron recuerda el mundo antes de que tuviera nombre. Bastón en mano, camina más despacio que todos pero siempre llega primero. Sus palabras son pocas y cada una pesa como una era.', 'Archimago que vivió más de lo que debería', 'Mago', 'Las Torres de Sal', 'vivo', FALSE, 5, 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200'),
('Mira Duskbane', 'La Sin Nombre', 'mira-duskbane', 'Le robaron el nombre en la infancia y desde entonces colecciona los nombres de sus enemigos. Asesina de gremios extintos, su presencia es el silencio antes del último sonido.', 'Asesina cuya identidad es un misterio deliberado', 'Asesina', 'Desconocido', 'vivo', FALSE, 6, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200');

-- ============================================================
-- DATOS DE EJEMPLO - LOCACIONES
-- ============================================================

INSERT INTO locaciones (nombre, slug, tipo, descripcion_lore, descripcion_corta, imagen_url, peligrosidad, descubierto) VALUES
('Las Tierras Grises', 'las-tierras-grises', 'region', 'Una vez fueron campos fértiles donde los niños jugaban bajo un sol que ya no recuerda este lugar. La guerra de los Dioses Menores las convirtió en lo que son: ceniza con memoria. Los que caminan aquí sienten el peso de vidas que no vivieron.', 'Vastas llanuras de ceniza donde el tiempo se mueve diferente', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', 'alta', TRUE),
('El Vacío Susurrante', 'el-vacio-susurrante', 'region', 'No es un lugar en el mapa. Es un lugar en la mente de quienes han mirado demasiado tiempo hacia la oscuridad. Algunos dicen que el Vacío susurra verdades. Otros dicen que susurra mentiras perfectas. La diferencia importa menos de lo que parece.', 'Dimensión liminal entre el mundo de los vivos y algo más antiguo', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800', 'mortal', TRUE),
('La Ciudad Sagrada de Auren', 'ciudad-sagrada-auren', 'region', 'Sus torres de mármol blanco aún brillan, pero el brillo es el de los huesos bajo el sol. La fe que la construyó la abandonó hace generaciones. Lo que queda son rituales sin dioses y sacerdotes sin fe, repitiendo palabras cuyo significado olvidaron.', 'Ciudad de mármol donde los dioses guardaron silencio', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800', 'media', TRUE),
('Las Catacumbas de Vel', 'catacumbas-de-vel', 'mazmorra', 'Vel fue un rey que amaba tanto a su pueblo que no pudo dejarlos morir. Los convirtió en algo que no muere. Ahora sus catacumbas son el hogar de lo que queda de ese amor: criaturas que recuerdan haber sido personas y no pueden olvidarlo.', 'Laberinto subterráneo habitado por los no-muertos del Rey Vel', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', 'mortal', TRUE),
('El Santuario Olvidado', 'santuario-olvidado', 'secreto', 'No aparece en ningún mapa porque los cartógrafos que lo encontraron decidieron, unánimemente, no incluirlo. Algo en ese lugar hace que las personas tomen decisiones sabias. Eso, por sí solo, debería ser suficiente advertencia.', 'Lugar sagrado que los mapas deliberadamente omiten', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'desconocido', FALSE);

-- ============================================================
-- DATOS DE EJEMPLO - OBJETOS
-- ============================================================

INSERT INTO objetos (nombre, slug, categoria_id, descripcion_lore, descripcion_corta, imagen_url, rareza, como_obtener, estadisticas)
SELECT 
  'Espada del Amanecer Roto',
  'espada-amanecer-roto',
  c.id,
  'Forjada en el último amanecer antes de que el sol aprendiera a ocultarse. Su hoja refleja una luz que ya no existe en este mundo. Quienes la empuñan dicen ver, por un instante, cómo era el mundo antes.',
  'Espada legendaria que porta la luz de un amanecer extinto',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  'legendario',
  'Forjada completando el ritual de los Tres Amaneceres en Las Tierras Grises',
  '{"ataque": 185, "peso": 6.5, "durabilidad": 999, "bonus_luz": 45}'::jsonb
FROM categorias c WHERE c.slug = 'espadas';

INSERT INTO objetos (nombre, slug, categoria_id, descripcion_lore, descripcion_corta, imagen_url, rareza, como_obtener, estadisticas)
SELECT
  'Lanza de Mireth',
  'lanza-de-mireth',
  c.id,
  'Tallada de un árbol del Bosque de Mireth la noche en que el bosque ardió. La madera no se quemó. Nadie sabe por qué. La lanza tampoco lo sabe, pero a veces tiembla cuando recuerda.',
  'Lanza de madera que sobrevivió al incendio del bosque sagrado',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
  'epico',
  'Encontrada en las ruinas del Bosque de Mireth',
  '{"ataque": 145, "alcance": 2.5, "peso": 4.2, "bonus_naturaleza": 30}'::jsonb
FROM categorias c WHERE c.slug = 'lanzas';

INSERT INTO objetos (nombre, slug, categoria_id, descripcion_lore, descripcion_corta, imagen_url, rareza, como_obtener, estadisticas)
SELECT
  'Poción de Sangre de Fénix',
  'pocion-sangre-fenix',
  c.id,
  'No es sangre de fénix. Nadie ha visto un fénix en tres eras. Es la esperanza destilada de alquimistas que creyeron que podían atrapar la resurrección en un frasco. Sorprendentemente, casi lo lograron.',
  'Elixir de curación que desafía la muerte momentáneamente',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
  'raro',
  'Elaborada por alquimistas en La Ciudad Sagrada de Auren',
  '{"curacion": 500, "usos": 1, "peso": 0.3, "tiempo_efecto": "instantaneo"}'::jsonb
FROM categorias c WHERE c.slug = 'pociones';

INSERT INTO objetos (nombre, slug, categoria_id, descripcion_lore, descripcion_corta, imagen_url, rareza, como_obtener, estadisticas)
SELECT
  'Armadura del Paladín Caído',
  'armadura-paladin-caido',
  c.id,
  'Cada abolladura en esta armadura corresponde a una oración no respondida. Hay muchas abolladuras. El metal recuerda cada golpe, cada plegaria, cada silencio divino. Pesa más de lo que debería.',
  'Armadura de placas marcada por batallas y fe perdida',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
  'epico',
  'Obtenida derrotando al Guardián de Auren en las Catacumbas de Vel',
  '{"defensa": 220, "peso": 28.5, "resistencia_magica": 45, "penalizacion_velocidad": -15}'::jsonb
FROM categorias c WHERE c.slug = 'armadura-placas';

-- ============================================================
-- DATOS DE EJEMPLO - ACTUALIZACIONES
-- ============================================================

INSERT INTO actualizaciones (titulo, slug, tipo, descripcion_corta, contenido, imagen_url, es_destacado, publicado, fecha_publicacion) VALUES
('Valdris el Cenizo se une al universo', 'valdris-el-cenizo-se-une', 'personaje', 'El primer portador de la llama hace su aparición. Descubre su historia, su maldición y los secretos que carga desde antes de que el mundo tuviera nombre.', 'Hoy presentamos a Valdris el Cenizo, el Último Portador de la Llama. Un guerrero que ha muerto y renacido más veces de las que puede recordar, cargando una llama que ilumina verdades que nadie desea ver. Su historia comienza en Las Tierras Grises y se extiende hacia lo desconocido.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200', TRUE, TRUE, NOW() - INTERVAL '2 days'),
('Las Catacumbas de Vel abren sus puertas', 'catacumbas-vel-reveladas', 'locacion', 'La primera mazmorra del universo queda revelada. El Rey Vel y su amor eterno por su pueblo crearon algo que no debería existir.', 'Las Catacumbas de Vel son el primer gran dungeon del universo. Un laberinto de amor y horror donde el Rey Vel convirtió a su pueblo en algo que no muere. Exploramos su historia, sus secretos y los peligros que aguardan en sus profundidades.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200', FALSE, TRUE, NOW() - INTERVAL '7 days'),
('La Espada del Amanecer Roto: Historia y Origen', 'espada-amanecer-roto-historia', 'objeto', 'El arma legendaria que porta la luz de un sol que ya no existe. Descubre cómo fue forjada y por qué su brillo es diferente a cualquier otro.', 'La Espada del Amanecer Roto es más que un arma. Es un fragmento de historia, un pedazo del mundo tal como era antes. Hoy revelamos su origen completo, el ritual necesario para obtenerla y los secretos que guarda su hoja.', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200', FALSE, TRUE, NOW() - INTERVAL '14 days');

CREATE TABLE IF NOT EXISTS public.monstruos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR NOT NULL,
    slug VARCHAR NOT NULL UNIQUE,
    raza VARCHAR NOT NULL DEFAULT 'humanoid',
    subtipo VARCHAR,
    descripcion_lore TEXT,
    descripcion_corta VARCHAR,
    icono_url VARCHAR,
    imagen_url VARCHAR,
    modelo_3d_url VARCHAR,
    tiene_modelo_3d BOOLEAN DEFAULT false,
    nivel_peligro VARCHAR DEFAULT 'normal',
    habitat VARCHAR,
    debilidades JSONB,
    resistencias JSONB,
    estadisticas JSONB,
    recompensas JSONB,
    es_jefe BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.monstruos (nombre, slug, raza, subtipo, descripcion_corta, descripcion_lore, icono_url, imagen_url, nivel_peligro, habitat, es_jefe, debilidades, estadisticas) VALUES
(
    'Valdris el Exánime',
    'valdris-el-exanime',
    'vampire',
    'Señor de Sangre',
    'Antiguo noble corrompido por el pacto de sangre eterno.',
    'Otrora un conde de la corte de Aethermoor, Valdris selló un pacto con la Oscuridad Primigenia para escapar de la muerte. Ahora vaga por las catacumbas de su antiguo castillo, drenando la esencia vital de los incautos que se atreven a profanar su morada.',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&fit=crop',
    'elite',
    'Catacumbas de Aethermoor',
    false,
    '["luz sagrada", "plata", "fuego"]',
    '{"vida": 2400, "ataque": 187, "defensa": 134, "velocidad": 98}'
),
(
    'Malgrath el Devorador',
    'malgrath-el-devorador',
    'demon',
    'Demonio Abismal',
    'Entidad primordial invocada desde las grietas del Vacío.',
    'Malgrath no fue creado, sino que siempre existió en los pliegues entre mundos. Cuando el Sello de los Siete se fracturó, encontró su camino hacia el plano mortal. Su sola presencia corrompe la tierra que pisa, convirtiendo el suelo fértil en ceniza estéril.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&fit=crop',
    'jefe',
    'Grietas del Vacío',
    true,
    '["luz divina", "runas de sellado"]',
    '{"vida": 8900, "ataque": 312, "defensa": 278, "velocidad": 67}'
),
(
    'Skareth Mediasombra',
    'skareth-mediasombra',
    'demihuman',
    'Cazador Umbral',
    'Criatura entre dos mundos, ni bestia ni hombre.',
    'Los Mediasombra nacen cuando un mortal cruza el Umbral sin morir del todo. Skareth fue el primero, un explorador que cayó en una grieta dimensional y emergió transformado. Ahora lidera a su clan de seres liminales en los bordes del mundo conocido.',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&fit=crop',
    'normal',
    'Fronteras del Umbral',
    false,
    '["magia de luz", "hierro bendito"]',
    '{"vida": 1100, "ataque": 143, "defensa": 89, "velocidad": 167}'
),
(
    'Gorveth el Encadenado',
    'gorveth-el-encadenado',
    'humanoid',
    'Guerrero Maldito',
    'Soldado inmortal condenado a luchar por una causa olvidada.',
    'Gorveth juró lealtad eterna a un rey cuyo nombre ha sido borrado de todos los registros. La maldición de su juramento lo mantiene vivo siglo tras siglo, obligándolo a defender un reino que ya no existe, atacando a todo aquel que se adentre en las ruinas de lo que fue su hogar.',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&fit=crop',
    'elite',
    'Ruinas del Reino Olvidado',
    false,
    '["magia de ruptura", "acero antiguo"]',
    '{"vida": 3200, "ataque": 234, "defensa": 198, "velocidad": 54}'
),
(
    'La Tejedora de Velos',
    'la-tejedora-de-velos',
    'spirit',
    'Espectro Ancestral',
    'Presencia etérea que teje los destinos de los mortales.',
    'Nadie recuerda cuándo apareció por primera vez. La Tejedora existe en el espacio entre el pensamiento y la realidad, manipulando los hilos del destino con dedos que no tienen forma. Se dice que verla es presagiar una muerte, aunque no necesariamente la propia.',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&fit=crop',
    'jefe',
    'El Espacio Entre',
    true,
    '["magia de anclaje", "cristal de alma"]',
    '{"vida": 6700, "ataque": 289, "defensa": 45, "velocidad": 234}'
),
(
    'Brukhar Pielroca',
    'brukhar-pielroca',
    'beast',
    'Bestia Primordial',
    'Criatura antigua cuya piel se ha petrificado con los siglos.',
    'Brukhar existía antes de que los primeros mortales pusieran nombre a las cosas. Su cuerpo, endurecido por milenios de existencia, es casi indistinguible de la roca viva. Duerme durante décadas y cuando despierta, su hambre es insaciable.',
    'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&fit=crop',
    'normal',
    'Cavernas Profundas',
    false,
    '["fuego intenso", "magia de tierra"]',
    '{"vida": 4500, "ataque": 267, "defensa": 312, "velocidad": 23}'
),
(
    'Nyxara la Susurrante',
    'nyxara-la-susurrante',
    'vampire',
    'Vampira Encantadora',
    'Seductora inmortal que colecciona almas como otros coleccionan joyas.',
    'Nyxara ha vivido mil vidas, cada una robada a una víctima diferente. Adopta la apariencia de aquellos a quienes drena, acumulando memorias y personalidades hasta que ya no recuerda cuál era la suya propia. Esta confusión la ha vuelto impredecible y peligrosa.',
    'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&fit=crop',
    'elite',
    'Ciudad de los Espejos',
    false,
    '["luz solar", "magia de verdad"]',
    '{"vida": 2800, "ataque": 198, "defensa": 112, "velocidad": 189}'
),
(
    'El Concilio de Ceniza',
    'el-concilio-de-ceniza',
    'demon',
    'Entidad Colectiva',
    'Siete demonios fundidos en una sola voluntad abrasadora.',
    'Cuando los Siete Demonios Menores del Fuego Eterno fueron derrotados por separado, sus esencias se fusionaron en la muerte, creando algo nuevo y terrible. El Concilio de Ceniza habla con siete voces simultáneas y recuerda siete vidas de odio acumulado.',
    'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&fit=crop',
    'jefe',
    'Forja del Fin del Mundo',
    true,
    '["agua sagrada", "hielo primordial"]',
    '{"vida": 12000, "ataque": 445, "defensa": 334, "velocidad": 89}'
);

-- ============================================
-- INSERCIÓN DE PERSONAJES
-- ============================================

INSERT INTO public.personajes (nombre, titulo, slug, lore, descripcion_corta, clase, origen, estado, es_protagonista, orden_circulo, activo)
VALUES (
  'El Perro',
  'El Bandido Callejero',
  'el-perro',
  'Bandido callejero, pragmático, astuto y mezquino. Representa la humanidad común, con vicios y destellos de virtud. Su motivación principal es llegar a la torre en búsqueda de riquezas y provecho personal, aunque una promesa hecha a un amigo muerto lo ata al viaje y al cuidado del niño.

Arco de transformación: Comienza como un oportunista egoísta. Durante el viaje, el vínculo con el niño despierta en él un afecto protector que confronta su pasado. Al final, sigue siendo vulgar y mezquino, pero es capaz de actuar por alguien más que por sí mismo.

Apariencia y personalidad: Astuto, borracho, egoísta, pero con momentos genuinos de cuidado hacia el niño. "Perro" refleja su vulgaridad, mezquindad y supervivencia callejera.',
  'Bandido callejero que oculta destellos de virtud tras una fachada de egoísmo y astucia.',
  'Bandido',
  'Las calles',
  'vivo',
  false,
  2,
  true
);

INSERT INTO public.personajes (nombre, titulo, slug, lore, descripcion_corta, clase, origen, estado, es_protagonista, orden_circulo, activo)
VALUES (
  'El Escudero',
  'El Niño Campesino',
  'el-escudero',
  'Protagonista central. Niño campesino medieval que representa la pureza, la esperanza y el crecimiento moral en un mundo hostil. Su motivación es cumplir la promesa paterna: ser un hombre recto y mantener sus valores. Busca sobrevivir al viaje, aprender del mundo adulto y ayudar a La Doncella, manteniendo al grupo unido emocionalmente.

Arco de transformación: Comienza ingenuo, justo, sin fuerza ni experiencia. Durante el viaje es expuesto a horrores y contradicciones humanas, aprendiendo a lidiar con la ambigüedad moral. Al final se convierte en un joven capaz de tomar decisiones difíciles, manteniendo su humanidad a pesar de las influencias del Juez y el trauma de La Doncella.

Apariencia: Niño campesino, ojos claros, expresivo. Su inocencia y curiosidad contrastan con el mundo oscuro que lo rodea. Pequeñas acciones revelan su ética: ayuda desinteresada, coraje silencioso, afecto genuino hacia La Doncella.',
  'Niño campesino, centro moral del grupo. Su inocencia es el faro en la oscuridad del viaje.',
  'Campesino',
  'El campo',
  'vivo',
  true,
  1,
  true
);

INSERT INTO public.personajes (nombre, titulo, slug, lore, descripcion_corta, clase, origen, estado, es_protagonista, orden_circulo, activo)
VALUES (
  'La Doncella',
  'La Princesa Resucitada',
  'la-doncella',
  'Hija de un mago y princesa, resucitada parcialmente como monstruo. Representa la corrupción por trauma y la lenta recuperación de la humanidad. Su motivación es sobrevivir y mantenerse funcional, aproximándose a Ismael (El Escudero), quien le ayuda a recuperar su humanidad. La torre representa para ella una amenaza y un destino inevitable, no un objetivo.

Arco de transformación: Comienza como un cascarón vacío, errática y animal. Durante el viaje va recuperando humanidad gracias al niño. Al final es más humana, pero conserva impulsos animales residuales.

Apariencia: Silenciosa, apenas gestos faciales. Rubia, ojos emperlados, cuerpo insectoide con armadura azul escarabajo. Su presencia inquieta incluso a los más curtidos del grupo.',
  'Princesa resucitada como monstruo, en un lento y frágil camino de regreso a su humanidad.',
  'Monstruo / Princesa',
  'El reino caído',
  'vivo',
  false,
  3,
  true
);

INSERT INTO public.personajes (nombre, titulo, slug, lore, descripcion_corta, clase, origen, estado, es_protagonista, orden_circulo, activo)
VALUES (
  'El Juez',
  'El Fanático Carismático',
  'el-juez',
  'Fanático, carismático y psicópata medieval inspirado en el Juez Holden. Representa el mal necesario y la corrupción moral del grupo. Su motivación es llegar a la torre para obtener el poder que cree que le será otorgado, reforzando su fanatismo y control. Busca corromper al niño y mantener su influencia sobre el grupo.

Arco de transformación: Comienza como una autoridad temible, risueño y manipulador. Durante el viaje sigue siendo corrupto, pero su mal paradójicamente mantiene vivo al grupo. Al final revela su monstruosidad completa; se enfurece si La Doncella recupera su humanidad.

Personalidad: Psicopatía aguda, manipulador, risueño. Sus actos aberrantes sostienen la supervivencia del grupo, lo que lo convierte en un mal necesario e incómodo.',
  'Fanático carismático y psicópata. Su maldad es el pegamento oscuro que mantiene vivo al grupo.',
  'Fanático / Juez',
  'La Santa Sede',
  'vivo',
  false,
  4,
  true
);

INSERT INTO public.personajes (nombre, titulo, slug, lore, descripcion_corta, clase, origen, estado, es_protagonista, orden_circulo, activo)
VALUES (
  'El Hechicero',
  'El Mago de Tierras Lejanas',
  'el-hechicero',
  'Mago de tierras lejanas, obsesionado con el conocimiento arcano. Representa la ambición intelectual y la vulnerabilidad frente a fuerzas más grandes. Su motivación es llegar a la torre para acceder a su biblioteca secreta y descubrir conocimientos prohibidos, aunque esa ambición termine distorsionándolo.

Arco de transformación: Comienza calmado, confiado y obsesivo. Durante el viaje, la exposición a la influencia de la torre comienza a distorsionar su mente; la paranoia y la obsesión crecen. Al final se convierte en la víctima temprana de la torre, y su caída sirve de advertencia al resto del grupo.

Apariencia: Túnicas de estilo árabe, símbolos astronómicos, amuletos. Personalidad obsesiva, meticulosa y arrogante. Función narrativa clave: introduce la influencia surreal y distorsionante de la torre sobre la mente humana.',
  'Mago obsesionado con el conocimiento prohibido. La torre lo distorsiona antes que a nadie.',
  'Hechicero',
  'Tierras lejanas del este',
  'vivo',
  false,
  5,
  true
);

INSERT INTO public.personajes (nombre, titulo, slug, lore, descripcion_corta, clase, origen, estado, es_protagonista, orden_circulo, activo)
VALUES (
  'El Viejo del Manto Blanco',
  'El Barón de la Frontera',
  'el-viejo-del-manto-blanco',
  'Antaño conocido como el Barón de la Frontera, fue uno de los hombres más poderosos de su era: político despiadado, manipulador, temido por reinos y ejércitos, respetado por la Santa Sede a regañadientes. Fue inspiración directa para El Juez, a quien enseñó que el poder no solo se mide en astucia sino en la dureza del puño. Su mayor hazaña fue la conquista y reconquista de Al''kabra, donde aniquiló pueblos enteros, arrasó templos paganos y saqueó reliquias prohibidas. Una de ellas, un fragmento de tela arrancado de un altar sacrificial, se convirtió en su manto blanco.

Hoy no queda más que un anciano débil, con la mente perdida en recuerdos borrosos y la obsesión fija de regresar al Pozo, el lugar que parece reclamarlo desde la antigüedad, ligado a una entidad que lo posee parcialmente. Escapó de la habitación de la Santa Sede donde lo mantenían con vida solo por lástima.

Aparición: Se cruza con el grupo de manera esporádica, siempre en apuros o en lugares insólitos. Sus encuentros son breves, desconcertantes, y dan indicios de su pasado grandioso y su decadencia presente.

Apariencia: Calvo con pelo corto blanco. Ojos velados, opacos, húmedos, que parecen no enfocar del todo. Piel pálida, casi traslúcida, marcada por manchas seniles. Camina encorvado, arrastrando el Manto Blanco, demasiado grande para su cuerpo esquelético. Cuando se detiene, parece un cadáver erguido que se niega a caer.',
  'El Barón de la Frontera, otrora terror de reinos. Hoy un anciano senil que arrastra su manto hacia el Pozo.',
  'Político / Señor de Guerra',
  'La Santa Sede',
  'vivo',
  false,
  6,
  true
);

-- ============================================
-- INSERCIÓN DE RELACIONES ENTRE PERSONAJES
-- ============================================

-- Relaciones de El Perro
INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'mentor_improvisado', 'Afecto creciente. El Perro actúa como mentor improvisado del niño, despertando en él un instinto protector que no esperaba.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-perro' AND p2.slug = 'el-escudero';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'desconfianza', 'El Perro ve a La Doncella como un riesgo calculable para la supervivencia del grupo.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-perro' AND p2.slug = 'la-doncella';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'tension', 'Tensión constante y pullas mutuas. El Perro protege al niño de la corrupción del Juez.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-perro' AND p2.slug = 'el-juez';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'desconfianza_mutua', 'Desconfianza y curiosidad. El Perro considera al Hechicero impredecible y un riesgo para la supervivencia.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-perro' AND p2.slug = 'el-hechicero';

-- Relaciones de El Escudero
INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'aprendizaje', 'El Perro es mentor y figura afectiva. El Escudero aprende astucia y pragmatismo de él.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-escudero' AND p2.slug = 'el-perro';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'catalizador', 'El Escudero es el catalizador de la recuperación humana de La Doncella. Su afecto genuino la ancla al mundo.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-escudero' AND p2.slug = 'la-doncella';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'conflicto_moral', 'El Juez es fuente de conflicto moral para el Escudero; pone a prueba su ética y valores constantemente.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-escudero' AND p2.slug = 'el-juez';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'admiracion_distante', 'Presencia distante y conceptual. El Escudero siente admiración y aprende parcialmente del Hechicero.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-escudero' AND p2.slug = 'el-hechicero';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'guia_ambiguo', 'El Viejo interactúa más directamente con el Escudero; lo guía, confunde o provoca reflexiones de forma breve y ambigua.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-escudero' AND p2.slug = 'el-viejo-del-manto-blanco';

-- Relaciones de La Doncella
INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'ancla_humana', 'El Escudero es el ancla de humanidad de La Doncella. Su presencia la estabiliza y la acerca a lo que fue.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'la-doncella' AND p2.slug = 'el-escudero';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'respeto_tenso', 'Respeto mutuo y tensión. El Juez la percibe como un igual monstruoso; ella lo reconoce como una amenaza comprensible.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'la-doncella' AND p2.slug = 'el-juez';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'desconfianza_calculada', 'Desconfianza inicial de La Doncella hacia El Perro; lo evalúa como un riesgo calculable.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'la-doncella' AND p2.slug = 'el-perro';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'desestabilizacion', 'La presencia y magia del Hechicero pueden desestabilizar a La Doncella. Interacción mínima pero inquietante.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'la-doncella' AND p2.slug = 'el-hechicero';

-- Relaciones de El Juez
INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'corrupcion', 'El Juez intenta corromper al Escudero y poner a prueba su ética constantemente.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-juez' AND p2.slug = 'el-escudero';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'reconocimiento_monstruoso', 'Respeto silencioso. El Juez reconoce en La Doncella un igual monstruoso; su recuperación de humanidad lo enfurece.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-juez' AND p2.slug = 'la-doncella';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'tension_moral', 'Tensión constante con El Perro; conflicto de moralidad y control entre ambos.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-juez' AND p2.slug = 'el-perro';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'uso_calculado', 'El Juez ve al Hechicero como un recurso útil aunque no confía en él; tensión intelectual entre ambos.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-juez' AND p2.slug = 'el-hechicero';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'inspiracion_decaida', 'El Juez reconoció al Viejo como mentor e inspiración; ve en él los ecos de su propia filosofía y también su decadencia.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-juez' AND p2.slug = 'el-viejo-del-manto-blanco';

-- Relaciones de El Hechicero
INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'distancia_conceptual', 'Presencia distante y conceptual hacia el Escudero; admiración parcial y aprendizaje mutuo limitado.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-hechicero' AND p2.slug = 'el-escudero';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'desconfianza_mutua', 'Desconfianza mutua con El Perro. El Hechicero lo considera impráctico pero necesario para el viaje.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-hechicero' AND p2.slug = 'el-perro';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'interaccion_perturbadora', 'Interacción mínima con La Doncella, pero su presencia puede exacerbar la distorsión mental del Hechicero.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-hechicero' AND p2.slug = 'la-doncella';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'respeto_cauteloso', 'Respeto cauteloso hacia El Juez; el Hechicero calcula el riesgo que representa para sus propios planes.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-hechicero' AND p2.slug = 'el-juez';

-- Relaciones de El Viejo del Manto Blanco
INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'guia_ambiguo', 'El Viejo interactúa directamente con el Escudero; lo guía, confunde o provoca reflexiones de forma breve y ambigua.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-viejo-del-manto-blanco' AND p2.slug = 'el-escudero';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'legado_filosofico', 'El Juez lo reconoce como mentor e inspiración. El Viejo enseñó que el poder se mide en la dureza del puño.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-viejo-del-manto-blanco' AND p2.slug = 'el-juez';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'indiferencia_reputada', 'El Perro conoce su reputación. El Hechicero sabe de sus campañas pero le tiene indiferencia.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-viejo-del-manto-blanco' AND p2.slug = 'el-perro';

INSERT INTO public.personaje_relaciones (personaje_origen_id, personaje_destino_id, tipo_relacion, descripcion)
SELECT p1.id, p2.id, 'miedo_instintivo', 'El Viejo reconoce algo extraño en La Doncella —la entidad que habita su cuerpo— y reacciona con miedo y cautela, evitando el contacto directo.'
FROM public.personajes p1, public.personajes p2
WHERE p1.slug = 'el-viejo-del-manto-blanco' AND p2.slug = 'la-doncella';

INSERT INTO public.personajes (
    nombre,
    titulo,
    slug,
    clase,
    origen,
    estado,
    es_protagonista,
    orden_circulo,
    descripcion_corta,
    lore,
    activo
) VALUES (
    'Ruth',
    'La Maga Oculta',
    'ruth-la-maga-oculta',
    'Maga / Alquimista',
    'La Torre',
    'vivo',
    false,
    7,
    'Madre de La Doncella, maga excepcional y alquimista autodidacta. Su amor obsesivo por su hija la llevó a la locura, convirtiéndose en la figura central y antagonista de la torre.',
    'ALIASES Y TÍTULOS:
- Ruth: nombre real.
- La Maga Oculta: título respetuoso/temoroso usado por serviles y cultos.
- Madre de las Profundidades: apodo susurrado entre los más supersticiosos.
- La Custodia: nombre usado por los cultos internos, refiriéndose a su rol como guardiana de La Doncella y los secretos de la torre.

ROL:
Madre de La Doncella, maga excepcional y alquimista autodidacta. Figura central de la mansión, cuya locura y obsesión crean un microcosmos dentro de la torre. Controla parcialmente a la servidumbre y a los experimentos fallidos, pero el poder es difuso y fragmentado, generando conflictos internos y cultos menores.

MOTIVACIÓN / OBJETIVOS:
- Revivir completamente a La Doncella y restaurar su humanidad.
- Progresivamente adopta el rol del padre fallecido, asumiendo su vestimenta y autoridad para continuar la investigación.
- Mantener la estructura de la mansión como reflejo de su obsesión y control sobre el espacio y los horrores creados.

ARCO DE TRANSFORMACIÓN:
1. Inicio: amorosa y preocupada, recién iniciada en la magia, aprende y se vuelve competente gracias al padre y la necesidad de salvar a su hija.
2. Progresión: frustración por fracasos médicos y mágicos, experimentación con magia oscura, obsesión por perfeccionar su magia para resucitar a su hija.
3. Locura intermedia: adopta la identidad del padre parcialmente, microcosmos de la mansión se fragmenta lentamente, cultos y facciones internas surgen.
4. Ruptura máxima: La Doncella escapa; la torre responde deformándose completamente, la locura de Ruth se intensifica, pierde contacto con la realidad, se vuelve aislada y peligrosa.

RELACIONES:
- La Doncella: hija; fuente de amor, obsesión y locura. Su escape provoca el colapso parcial de Ruth y la mansión.
- Padre de Fàrmine: inspiración y modelo, su muerte desencadena el proceso de transformación de Ruth.
- Servidumbre y esbirros: temor; algunos cuchichean y conspiran, otros forman cultos menores, otros aún le guardan respeto y lealtad.

PSICOLOGÍA:
Locura gradual y natural, basada en amor obsesivo, miedo a perder a Fàrmine, y la creencia en que la magia puede arreglarlo todo. La mansión es un reflejo vivo de su estado emocional: empieza coherente y funcional, luego se fragmenta y se vuelve surreal. Personalidad: amorosa → obsesiva → manipuladora y calculadora → aislada y desquiciada.

APARIENCIA:
Inicialmente maternal, luego adopta vestimenta y símbolos del padre (túnicas, amuletos, signos alquímicos). Mirada intensa, mezcla de cuidado y amenaza, reflejando su locura y obsesión.

FUNCIÓN NARRATIVA:
Catalizadora de la historia de La Doncella y de la progresión surrealista de la torre. Permite explorar la locura gradual, obsesión y consecuencias del amor extremo. Introduce microcosmos de conflictos internos: cultos, facciones, servidumbre ambivalente.',
    true
);

-- Relación Ruth → La Doncella (madre/hija, fuente de obsesión)
INSERT INTO public.personaje_relaciones (
    personaje_origen_id,
    personaje_destino_id,
    tipo_relacion,
    descripcion
)
SELECT
    r.id,
    d.id,
    'madre_hija',
    'Ruth es la madre de La Doncella. Su amor obsesivo por resucitarla completamente es el motor de su locura y el catalizador de toda la narrativa de la torre.'
FROM public.personajes r, public.personajes d
WHERE r.slug = 'ruth-la-maga-oculta'
  AND d.slug = 'la-doncella';

-- Agregar campo color_glow a la tabla personajes
ALTER TABLE personajes 
ADD COLUMN color_glow VARCHAR DEFAULT '#ffffff';

-- Actualizar con colores característicos para cada personaje existente
-- Basados en personalidad y características visuales

-- La Doncella: Rosa pálido (delicada, femenina, pura)
UPDATE personajes 
SET color_glow = '#FFB6C1' 
WHERE slug = 'la-doncella';

-- El Caballero: Azul acero (noble, protector, honorable)
UPDATE personajes 
SET color_glow = '#4682B4' 
WHERE slug = 'el-caballero';

-- El Mago: Púrpura místico (sabiduría, magia, misterio)
UPDATE personajes 
SET color_glow = '#9370DB' 
WHERE slug = 'el-mago';

-- El Pícaro: Verde esmeralda (astuto, ágil, sigiloso)
UPDATE personajes 
SET color_glow = '#2E8B57' 
WHERE slug = 'el-picaro';

-- El Bárbaro: Rojo intenso (fuerza, pasión, ferocidad)
UPDATE personajes 
SET color_glow = '#DC143C' 
WHERE slug = 'el-barbaro';

-- El Clérigo: Dorado sagrado (divino, sanador, luz)
UPDATE personajes 
SET color_glow = '#FFD700' 
WHERE slug = 'el-clerigo';

-- Tabla para almacenar múltiples frases por personaje
CREATE TABLE IF NOT EXISTS public.personaje_frases
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personaje_id UUID NOT NULL,
    frase TEXT NOT NULL,
    tipo VARCHAR DEFAULT 'general',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para mejorar consultas por personaje
CREATE INDEX IF NOT EXISTS idx_personaje_frases_personaje_id ON public.personaje_frases(personaje_id);

-- Insertar frases de ejemplo para diferentes tipos de personajes

-- Frases para La Doncella (humanidad perdida, frases cortas y poco expresivas)
INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, '...Home...', 'melancolia' FROM personajes WHERE slug = 'la-doncella' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, '...I remember...', 'memoria' FROM personajes WHERE slug = 'la-doncella' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, '...Cold...', 'sensacion' FROM personajes WHERE slug = 'la-doncella' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, '...Once...I was...', 'pasado' FROM personajes WHERE slug = 'la-doncella' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, '...Silence...', 'vacio' FROM personajes WHERE slug = 'la-doncella' LIMIT 1;

-- Frases para El Juez (maquiavélicas, inteligentes, estilo Judge Holden)
INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'The arc of history is long, but it bends toward those who seize it.', 'filosofica' FROM personajes WHERE slug = 'el-juez' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'Moral law is an invention of mankind for the disenfranchisement of the powerful.', 'moral' FROM personajes WHERE slug = 'el-juez' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'War is the ultimate game, and I am its most devoted player.', 'guerra' FROM personajes WHERE slug = 'el-juez' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'Whatever exists without my knowledge exists without my consent.', 'poder' FROM personajes WHERE slug = 'el-juez' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'The truth is that the forms of human conflict are finite. Justice is but a construct.', 'verdad' FROM personajes WHERE slug = 'el-juez' LIMIT 1;

-- Frases para El Perro/Bandido (astuto de la calle, corazón oculto)
INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'Trust? That''s a luxury I can''t afford.', 'desconfianza' FROM personajes WHERE slug = 'el-perro' OR slug = 'el-bandido' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'I made a promise... and I keep my promises.', 'promesa' FROM personajes WHERE slug = 'el-perro' OR slug = 'el-bandido' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'The streets taught me everything I need to know.', 'origen' FROM personajes WHERE slug = 'el-perro' OR slug = 'el-bandido' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'Survival first. Morals second.', 'pragmatico' FROM personajes WHERE slug = 'el-perro' OR slug = 'el-bandido' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'The kid... he reminds me of someone I used to be.', 'reflexion' FROM personajes WHERE slug = 'el-perro' OR slug = 'el-bandido' LIMIT 1;

-- Frases para El Niño (inocencia, esperanza, vulnerabilidad)
INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'Will we find them? Will we find home?', 'esperanza' FROM personajes WHERE slug = 'el-nino' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'I''m not scared... not anymore.', 'valentia' FROM personajes WHERE slug = 'el-nino' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'The stars look different here.', 'observacion' FROM personajes WHERE slug = 'el-nino' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'I remember my mother''s voice...', 'nostalgia' FROM personajes WHERE slug = 'el-nino' LIMIT 1;

-- Frases para El Hechicero (místico, enigmático, sabio)
INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'The threads of fate are visible to those who know where to look.', 'mistico' FROM personajes WHERE slug = 'el-hechicero' OR slug = 'el-mago' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'Magic is merely understanding what others cannot perceive.', 'sabiduria' FROM personajes WHERE slug = 'el-hechicero' OR slug = 'el-mago' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'Every spell has a price. Are you willing to pay it?', 'advertencia' FROM personajes WHERE slug = 'el-hechicero' OR slug = 'el-mago' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'The old ways are not forgotten, merely sleeping.', 'tradicion' FROM personajes WHERE slug = 'el-hechicero' OR slug = 'el-mago' LIMIT 1;

-- Frases para El Escudero (leal, honorable, protector)
INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'My oath binds me, and I am honored by it.', 'honor' FROM personajes WHERE slug = 'el-escudero' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'A shield is only as strong as the will behind it.', 'determinacion' FROM personajes WHERE slug = 'el-escudero' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'I will stand between you and the darkness.', 'proteccion' FROM personajes WHERE slug = 'el-escudero' LIMIT 1;

INSERT INTO personaje_frases (personaje_id, frase, tipo) 
SELECT id, 'Duty is heavier than a mountain, but I carry it gladly.', 'deber' FROM personajes WHERE slug = 'el-escudero' LIMIT 1;
