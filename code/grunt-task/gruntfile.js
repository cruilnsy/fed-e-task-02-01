const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/woflow'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/woflow'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

module.exports = grunt => {
  loadGruntTasks(grunt)
  grunt.initConfig({
    clean: {
      temp: ['temp/**'],
      dist: ['dist/**']
    },
    eslint: {
      target: ['src/assets/scripts/main.js']
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'temp/**',
          ]
        },
        options: {
          notify: false,
          watchTask: true,
          server: {
            baseDir: ['temp', 'src', 'public'],
            routes: {
              '/node_modules': 'node_modules'
            }
          }
        }
      }
    },
    sass: {
      options: {
        sourceMap: true,
        implementation: sass
      },
      main: {
        files: {
          'temp/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          'temp/assets/scripts/main.js': 'src/assets/scripts/main.js'
        }
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['assets/images/**/*', 'assets/fonts/**/*'],
          dest: 'temp/'
        }]
      }
    },
    swig: {
      options: {
        data
      },
      temp: {
        files: {
          'temp/index.html': ['src/index.html'],
          'temp/about.html': ['src/about.html'],
        },
      },
    },
    watch: {
      js: {
        files: ['src/assets/scripts/*.js'],
        tasks: ['babel']
      },
      css: {
        files: ['src/assets/styles/*.scss'],
        tasks: ['sass']
      }
    },
    cssmin: {
      vendor: {
        files: {
          'dist/assets/styles/vendor.css': ['node_modules/bootstrap/dist/css/bootstrap.css'],
        }
      },
      main: {
        files: {
          'dist/assets/styles/main.css': ['temp/assets/styles/main.css']
        }
      }
    },
    uglify: {
      build: {
        files: {
          'dist/assets/scripts/vendor.js': [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/popper.js/dist/umd/popper.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
          ],
          'dist/assets/scripts/main.js': [
            'temp/assets/scripts/main.js',
          ],
        }
      }
    },
    useref: {
      html: ['temp/index.html', 'temp/about.html'],
      temp: 'dist'
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            src: ['**/*'],
            dest: 'dist',
            cwd: 'temp'
          },
        ]
      }
    },
  })

  grunt.registerTask('lint', ['eslint'])
  grunt.registerTask('serve', ['browserSync', 'watch'])
  grunt.registerTask('start', ['clean', 'swig', 'sass', 'eslint', 'babel', 'browserSync', 'watch'])
  grunt.registerTask('build', ['clean', 'swig', 'sass', 'eslint', 'babel', 'imagemin', 'copy:build', 'cssmin', 'uglify', 'useref'])
}