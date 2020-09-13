meta:
  id: err_test
  endian: le
seq:
  - id: a
    size: 6
  - id: b
    type: foo
types:
  foo:
    seq:
      - id: c
        type: u2
      - id: d
        contents: 'PACL'
      - id: f
        type: u1
instances:
  e:
    -webide-parse-mode: lazy
    value: 6
