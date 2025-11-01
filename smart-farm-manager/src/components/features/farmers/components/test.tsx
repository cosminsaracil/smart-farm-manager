import { yupResolver } from "@hookform/resolvers/yup";

import { useQueryClient } from "@tanstack/react-query";

import { useMemo, useState } from "react";

import { useForm } from "react-hook-form";

import * as yup from "yup";

import { Button } from "@/components/ui/button";

import { Dialog } from "@/components/ui/Dialog";

import { Drawer } from "@/components/ui/Drawer";

import { Form, FormField } from "@/components/ui/Form/form";

import { FormInputField } from "@/components/ui/Form/FormInputField";

import { FormSelectField } from "@/components/ui/Form/FormSelectField";

import { getAllAssessmentsQueryKey } from "@/generated/@tanstack/react-query.gen";

import { usePostAssessment } from "@/hooks/api/Assessments/usePostAssessment";

import { ControlFrameworksDropdownList } from "../types";

const schema = yup.object({
  name: yup.string().required("Name is required"),

  framework_id: yup.string().required("Framework is required"),
});

type FormData = yup.InferType<typeof schema>;

export const CreateAssessmentDrawer = ({
  data,
}: {
  data: ControlFrameworksDropdownList[];
}) => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const frameworks = data.map((framework) => {
    return {
      label: `(${framework.name})`,

      value: framework.id?.toString() || "",
    };
  });

  const form = useForm<FormData>({
    resolver: yupResolver(schema),

    defaultValues: {
      name: "",

      framework_id: "",
    },

    mode: "all",
  });

  const {
    watch,

    handleSubmit,

    reset,

    control,

    formState: { isValid },
  } = form;

  const createAssessmentMut = usePostAssessment({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAllAssessmentsQueryKey() });
    },

    onError: (error) => {
      console.error("Error creating assessment:", error);
    },
  });

  const formValues = watch();

  const isSubmitDisabled =
    !isValid ||
    Object.keys(formValues).length === 0 ||
    createAssessmentMut.isPending;

  const isFormUpdated = useMemo(() => {
    return Object.values(formValues).some((value) => value !== "");
  }, [formValues]);

  const onSubmit = async (data: FormData) => {
    try {
      await createAssessmentMut.mutateAsync({
        body: {
          name: data.name,

          framework_id: parseInt(data.framework_id),
        },
      });

      setOpenDrawer(false);

      reset();
    } catch (error) {
      console.error("Error creating assessment:", error);
    }
  };

  const onDialogConfirmCancel = () => {
    reset();

    setOpenDialog(false);

    setOpenDrawer(false);
  };

  const onDialogCancel = () => {
    setOpenDialog(false);
  };

  const handleCancel = () => {
    if (isFormUpdated) setOpenDialog(true);
    else {
      setOpenDrawer(false);

      reset(undefined, { keepErrors: false });
    }
  };

  const handleDrawerClose = ({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) {
      if (isFormUpdated) setOpenDialog(true);
      else {
        setOpenDrawer(false);

        reset(undefined, { keepErrors: false });
      }
    }
  };

  const toggleDrawerState = (isOpen: boolean) => {
    if (isOpen) {
      setOpenDrawer(true);
    } else {
      handleDrawerClose({ isOpen });
    }
  };

  const renderDrawerFooter = () => {
    return (
      <>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitDisabled}>
          Submit
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </>
    );
  };

  return (
    <>
      <Drawer
        open={openDrawer}
        onOpenChange={toggleDrawerState}
        trigger={<Button variant="outline">Create Assessment</Button>}
        title="Create New Assessment"
        footer={renderDrawerFooter()}
        hideFooterCloseButton
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormInputField label="Name" required {...field} />
              )}
            />
            <FormField
              control={control}
              name="framework_id"
              render={({ field }) => (
                <FormSelectField
                  required
                  fullWidth
                  label="Framework"
                  options={frameworks}
                  {...field}
                />
              )}
            />
          </form>
        </Form>
      </Drawer>
      <Dialog
        open={openDialog}
        setOpen={setOpenDialog}
        title="Cancel Form"
        description="Are you sure you want to cancel? All changes will be lost."
        onConfirm={onDialogConfirmCancel}
        onCancel={onDialogCancel}
      />
    </>
  );
};
